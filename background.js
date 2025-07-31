chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL("rules.json"))
    .then((response) => response.json())
    .then((rules) => {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((r) => r.id),
        addRules: rules,
      });
      console.log("AdBlocker rules loaded:", rules.length);
    });
});

const DOUBLECLICK_DOMAIN = "doubleclick.net";
const DOUBLECLICK_URL = "https://" + DOUBLECLICK_DOMAIN;
const OPT_OUT_COOKIE_NAME = "id";
const OPT_OUT_COOKIE_VALUE = "OPT_OUT";
const IDE_COOKIE_NAME = "IDE";

const COOKIE_EXPIRATION_DATE = 2285906982; // Year 2042

function setIdCookie(storeId) {
  const optOutCookie = {
    name: OPT_OUT_COOKIE_NAME,
    value: OPT_OUT_COOKIE_VALUE,
    domain: "." + DOUBLECLICK_DOMAIN,
    url: DOUBLECLICK_URL,
    expirationDate: COOKIE_EXPIRATION_DATE,
    sameSite: "no_restriction",
    secure: true,
    storeId,
  };
  chrome.cookies.set(optOutCookie);
}

function removeIdeCookie(storeId) {
  chrome.cookies.remove({
    url: DOUBLECLICK_URL,
    name: IDE_COOKIE_NAME,
    storeId,
  });
}

chrome.cookies.onChanged.addListener((event) => {
  if (!event.cookie.domain.includes(DOUBLECLICK_DOMAIN)) return;

  if (event.cookie.name === IDE_COOKIE_NAME && !event.removed) {
    removeIdeCookie(event.cookie.storeId);
    setIdCookie(event.cookie.storeId);
  }

  if (
    event.cookie.name === OPT_OUT_COOKIE_NAME &&
    (event.cookie.value !== OPT_OUT_COOKIE_VALUE || event.removed)
  ) {
    setIdCookie(event.cookie.storeId);
  }
});
