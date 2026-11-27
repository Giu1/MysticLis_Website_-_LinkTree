/*
 * Mystic Lis — design versions.
 *
 * Every design change is a new version, so it can be compared with the
 * earlier ones. Each version is a list of extra stylesheets and scripts that
 * sit on top of assets/styles.css (V1 is the original site with nothing added).
 *
 *   ?v=v2           open a page in a given version
 *   [ and ]         step to the previous / next version
 *   compare.html    two versions side by side
 *
 * The switcher bar only shows on a local server (localhost / 127.0.0.1) or
 * with ?versions=1, so the public site never shows it. The public site uses
 * PUBLISHED, so a new version only goes live when PUBLISHED is changed.
 */
(function () {
  var VERSIONS = [
    { id: "v1", label: "V1", name: "Original", css: [], js: [] },
    {
      id: "v2",
      label: "V2",
      name: "Atelier",
      css: ["assets/versions/v2.css"],
      js: ["assets/versions/v2.js"],
      fonts:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
    }
  ];
  var PUBLISHED = "v1";
  var KEY = "mysticlis-version";

  /* compare.html only needs the list. */
  if (window.MysticLisVersionsListOnly) {
    window.MysticLisVersions = { list: VERSIONS, published: PUBLISHED };
    return;
  }

  var params = new URLSearchParams(location.search);
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  var showBar = (isLocal || params.get("versions") === "1") && params.get("embed") !== "1";
  var fromUrl = params.get("v");

  function find(id) {
    for (var i = 0; i < VERSIONS.length; i++) if (VERSIONS[i].id === id) return VERSIONS[i];
    return null;
  }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var latest = VERSIONS[VERSIONS.length - 1].id;
  var current =
    find(fromUrl) ||
    (showBar ? find(stored) || find(latest) : find(PUBLISHED));
  if (!fromUrl && showBar) {
    try { localStorage.setItem(KEY, current.id); } catch (e) {}
  }

  var root = document.documentElement;
  root.setAttribute("data-version", current.id);

  if (current.fonts) {
    document.write('<link rel="stylesheet" href="' + current.fonts + '">');
  }
  current.css.forEach(function (href) {
    document.write('<link rel="stylesheet" href="' + href + '">');
  });
  current.js.forEach(function (src) {
    document.write('<script src="' + src + '" defer><\/script>');
  });

  function go(id) {
    try { localStorage.setItem(KEY, id); } catch (e) {}
    var p = new URLSearchParams(location.search);
    if (p.has("v")) p.set("v", id);
    var q = p.toString();
    location.href = location.pathname + (q ? "?" + q : "") + location.hash;
  }

  /* A page opened with ?v= keeps that version on links to the other pages
     (needed for compare.html, where each side is pinned to one version). */
  if (fromUrl) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank") return;
      var url = new URL(a.getAttribute("href"), location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      url.searchParams.set("v", current.id);
      if (params.get("embed") === "1") url.searchParams.set("embed", "1");
      a.href = url.pathname + url.search + url.hash;
    }, true);
  }

  if (!showBar) return;

  document.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("input, textarea, select")) return;
    var i = VERSIONS.indexOf(current);
    if (e.key === "]" && i < VERSIONS.length - 1) go(VERSIONS[i + 1].id);
    if (e.key === "[" && i > 0) go(VERSIONS[i - 1].id);
  });

  document.addEventListener("DOMContentLoaded", function () {
    var css =
      ".ml-versions{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:4px;padding:5px;border-radius:999px;background:rgba(24,22,30,.86);color:#fff;font:600 12px/1 Inter,system-ui,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,.28);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}" +
      ".ml-versions span{padding:0 8px 0 10px;opacity:.6;letter-spacing:.08em;text-transform:uppercase;font-size:10px}" +
      ".ml-versions button,.ml-versions a{appearance:none;border:0;margin:0;cursor:pointer;color:inherit;text-decoration:none;font:inherit;padding:8px 12px;border-radius:999px;background:transparent;white-space:nowrap}" +
      ".ml-versions button:hover,.ml-versions a:hover{background:rgba(255,255,255,.12)}" +
      ".ml-versions button[aria-pressed=true]{background:#fff;color:#18161e}" +
      ".ml-versions button small{opacity:.65;font-weight:500;margin-left:4px}" +
      ".ml-versions a{border-left:1px solid rgba(255,255,255,.18);border-radius:0 999px 999px 0;margin-left:2px}" +
      "@media (max-width:520px){.ml-versions button small{display:none}.ml-versions span{display:none}}" +
      "@media print{.ml-versions{display:none}}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.className = "ml-versions";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Versao do design");
    bar.innerHTML = "<span>Versao</span>";
    VERSIONS.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", String(v === current));
      b.title = v.label + " — " + v.name + (v.id === PUBLISHED ? " (publicada)" : "");
      b.innerHTML = v.label + "<small>" + v.name + "</small>";
      b.addEventListener("click", function () { if (v !== current) go(v.id); });
      bar.appendChild(b);
    });
    var cmp = document.createElement("a");
    var page = location.pathname.split("/").pop() || "index.html";
    cmp.href = "compare.html?page=" + encodeURIComponent(page);
    cmp.textContent = "Lado a lado";
    bar.appendChild(cmp);
    document.body.appendChild(bar);
  });

  window.MysticLisVersions = { list: VERSIONS, current: current.id, published: PUBLISHED };
})();
