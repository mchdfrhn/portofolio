import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_TV2McuNu.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CmlbhCbj.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/mchdfrhn/Project/my-portofolio/","cacheDir":"file:///home/mchdfrhn/Project/my-portofolio/node_modules/.astro/","outDir":"file:///home/mchdfrhn/Project/my-portofolio/dist/","srcDir":"file:///home/mchdfrhn/Project/my-portofolio/src/","publicDir":"file:///home/mchdfrhn/Project/my-portofolio/public/","buildClientDir":"file:///home/mchdfrhn/Project/my-portofolio/dist/client/","buildServerDir":"file:///home/mchdfrhn/Project/my-portofolio/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/cv","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/cv\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"cv","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/cv.ts","pathname":"/api/cv","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/mchdfrhn/Project/my-portofolio/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/cv@_@ts":"pages/api/cv.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_ChhheCyl.mjs","/home/mchdfrhn/Project/my-portofolio/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DsG2V5_M.mjs","@/components/Navbar":"_astro/Navbar.6bp5WpeE.js","@/components/Projects":"_astro/Projects.BOO66mGq.js","/home/mchdfrhn/Project/my-portofolio/src/components/ScrollProgress":"_astro/ScrollProgress.DGelzW4P.js","/home/mchdfrhn/Project/my-portofolio/src/components/LanguageLoader":"_astro/LanguageLoader.WVS_RWPe.js","@astrojs/react/client.js":"_astro/client.CcpfLa-g.js","/home/mchdfrhn/Project/my-portofolio/src/components/Hero.astro?astro&type=script&index=0&lang.ts":"_astro/Hero.astro_astro_type_script_index_0_lang.CtVvI0I9.js","/home/mchdfrhn/Project/my-portofolio/src/components/Contact.astro?astro&type=script&index=0&lang.ts":"_astro/Contact.astro_astro_type_script_index_0_lang.QIGQSE48.js","/home/mchdfrhn/Project/my-portofolio/src/components/Footer.astro?astro&type=script&index=0&lang.ts":"_astro/Footer.astro_astro_type_script_index_0_lang.V9zeB41S.js","/home/mchdfrhn/Project/my-portofolio/src/components/SmoothScroll.astro?astro&type=script&index=0&lang.ts":"_astro/SmoothScroll.astro_astro_type_script_index_0_lang.CjjfJcaN.js","/home/mchdfrhn/Project/my-portofolio/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/mchdfrhn/Project/my-portofolio/src/components/Footer.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"back-to-top\");window.addEventListener(\"scroll\",()=>{window.scrollY>300?(t?.classList.remove(\"opacity-0\",\"translate-y-4\"),t?.classList.add(\"opacity-100\",\"translate-y-0\")):(t?.classList.remove(\"opacity-100\",\"translate-y-0\"),t?.classList.add(\"opacity-0\",\"translate-y-4\"))});"]],"assets":["/_astro/index.DTIVN8QX.css","/favicon.ico","/favicon.svg","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","/_astro/Contact.astro_astro_type_script_index_0_lang.QIGQSE48.js","/_astro/Hero.astro_astro_type_script_index_0_lang.CtVvI0I9.js","/_astro/LanguageLoader.WVS_RWPe.js","/_astro/Navbar.6bp5WpeE.js","/_astro/Projects.BOO66mGq.js","/_astro/ScrollProgress.DGelzW4P.js","/_astro/SmoothScroll.astro_astro_type_script_index_0_lang.CjjfJcaN.js","/_astro/_commonjsHelpers.CqkleIqs.js","/_astro/client.CcpfLa-g.js","/_astro/index.CB87Sc6I.js","/_astro/index.DRBSO1Sf.js","/_astro/proxy.R3wsdYri.js","/_astro/utils.DxbzmsGZ.js","/images/profile/profileImage.jpeg","/images/projects/sistem-jafung.png","/images/projects/sistem-pegawai.png","/images/projects/sistem-sipekad.png","/images/projects/sipekad/image.jpeg","/images/projects/dashboard-pegawai/image.jpeg","/images/projects/dashboard-jafung/image.jpeg","/images/projects/website-kampus/image.jpeg","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"kkioov242FxfcidRWZQ/mvfP9SRvfdISn5Smg1AjTpI="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
