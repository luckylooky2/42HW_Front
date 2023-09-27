export function getCookie(name: string) {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? value[2] : null;
}

export function deleteCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
