function ajax(method, url, data, onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    }
  };

  xhr.send(data);
  return xhr;
}
