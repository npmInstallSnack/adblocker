document.querySelectorAll('[id*="ad"], iframe[src*="ads"]').forEach((el) => {
  el.style.display = "none";
});
// Remove elements with IDs that look like ads (JS, for dynamic and static content)
(function removeAdElements() {
  const adIdPatterns = [/ad[-_]?/i, /ads[-_]?/i, /^ad\d+$/i, /^ads\d+$/i];
  function isAdId(id) {
    return adIdPatterns.some((re) => re.test(id));
  }
  function removeAds() {
    const all = document.querySelectorAll("[id]");
    all.forEach((el) => {
      if (isAdId(el.id)) {
        el.remove();
      }
    });
  }
  // Initial run
  removeAds();
  // Observe for dynamically added elements
  const observer = new MutationObserver(() => removeAds());
  observer.observe(document.body, { childList: true, subtree: true });
})();
