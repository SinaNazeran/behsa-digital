/* Old Vite URLs were hash-based (/#/about). The hash never reaches the
   server, so this forwards them on the client. Loaded by app/layout.tsx. */
(function () {
  var h = location.hash;
  if (h.indexOf("#/") === 0) {
    var p = h.slice(1);
    if (p === "/products") p = "/product";
    location.replace(p);
  }
})();
