export function getCookie(name: string) {
  var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value ? value[2] : null;
}

// Domain 설정을 해주지 않으면 안 됨!
export function deleteCookie(name: string) {
  document.cookie =
    name + "=; Domain=helloworld42.com; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
