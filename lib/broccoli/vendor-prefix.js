window.LeanesENV = (function(LeanesENV, extra) {
  for (var key in extra) {
    LeanesENV[key] = extra[key];
  }

  return LeanesENV;
})(window.LeanesENV || {}, {{LEANES_ENV}});

var runningTests = false;

{{content-for 'vendor-prefix'}}
