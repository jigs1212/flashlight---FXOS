(function app() {
  'use strict';

  var eventName = document.getElementById("1").ontouchdown ? 'touchdown' : 'mousedown';
  var eventName2 = document.getElementById("2").ontouchdown ? 'touchdown' : 'mousedown';
  var eventName3 = document.getElementById("3").ontouchdown ? 'touchdown' : 'mousedown';

  function setupCamera(next) {
    if (!navigator.mozCameras) {
      return next('No camera');
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////
    function found(camera) {
      if (count <= 0) {
        return;
      }
      count--;
      if (camera) {
        var flashModes = camera.capabilities.flashModes;
        console.log('flashModes: ' + flashModes);
        if (flashModes && flashModes.indexOf('torch') >= 0) {
          count = -1;
          next(null, camera);
        }
      }
      if (!count) {
        next('No flash');
      }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////
    function getCameraPromise(id) {
      var promise = navigator.mozCameras.getCamera({
        camera: cameras[i]
      }, {mode: 'unspecified'}).then(function(result) {
        found(result.camera);
      });
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////
    function getCameraCallback(id) {
      navigator.mozCameras.getCamera({
        camera: id
      }, null, found, function(err) {
        throw new Error(err);
      });
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////
    var oldStyle = navigator.mozCameras.getCamera.length == 3;
    console.log('oldStyle', oldStyle);
    var getCamera = oldStyle ? getCameraCallback : getCameraPromise;

    var cameras = navigator.mozCameras.getListOfCameras();
    var count = cameras.length;
    console.log('getListOfCameras: ' + count);
    for (var i = 0; i < count; i++) {
      console.log('getCamera:', cameras[i]);
      getCamera(cameras[i]);
    }
    if (!count) {
      next('No camera');
    }
  }

  var torching = false;
  var currentCamera = null;
//////////////////////////////////////////////////////////////////////////////////////////////////////
  function trigger(to, release) {
    torching = (to != null) ? to : (!torching);

    if (torching) {
  	document.getElementById("1").classList.add('torching');
    document.getElementById("title").style = "visibility:hidden;";
    document.getElementById("1").style = "color:#fff;";
    document.getElementById("3").style = "visibility:hidden;";
    document.getElementById("2").style = "visibility:hidden;";
    document.getElementById("content").style = "color:#000;";
    } else {
      window.location.reload(true);
    }

    if (currentCamera) {
      currentCamera.flashMode = (torching) ? 'torch' : 'auto';
      console.log('Set flashMode:', currentCamera.flashMode);
      return;
    }

    console.log('Calling setupCamera');
    setupCamera(function(err, camera) {
      if (!camera) {
        console.warn(err);
        document.body.classList.add('unsupported');
        return;
      }
      document.body.classList.add('supported');
      currentCamera = camera;
      console.log('Setting flashMode');
      camera.flashMode = (torching) ? 'torch' : 'auto';
    });
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////
var scrlight = false;
function trigger2(to, release) {
    scrlight = (to != null) ? to : (!scrlight);

    if (scrlight) {
    document.getElementById("2").classList.add('scrlight');
	  document.body.style= "background-color: #fff";
    document.getElementById("title").style = "visibility:hidden;";
    document.getElementById("3").style = "visibility:hidden;";
    document.getElementById("1").style = "visibility:hidden;";
    document.getElementById("content").style = "color:#000;";
    } else {
      document.getElementById("2").classList.remove('scrlight');
	    window.location.reload(true);
    }
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////
var scrlight1 = false;
function trigger3(to, release) {
    scrlight1 = (to != null) ? to : (!scrlight1);

    if (scrlight1) {
    document.getElementById("3").classList.add('scrlight1');
    document.getElementById("none").id = "body";
    document.getElementById("title").style = "visibility:hidden;";
    document.getElementById("2").style = "visibility:hidden;";
    document.getElementById("1").style = "visibility:hidden;";
    document.getElementById("content").style = "color:#000;";
    } else {
      document.getElementById("3").classList.remove('scrlight1');
      window.location.reload(true);
    }
  }//////////////////////////////////////////////////////////////////////////////////////////////////////
  document.getElementById("1").addEventListener(eventName, function(evt) {
    evt.preventDefault();
    trigger();
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////
  document.getElementById("2").addEventListener(eventName2, function(evt) {
    evt.preventDefault();
    trigger2();
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("3").addEventListener(eventName3, function(evt) {
    evt.preventDefault();
    trigger3();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      trigger(false);
      if (currentCamera) {
        currentCamera.release(function() {
          console.log('Camera released');
        });
        currentCamera = null;
      }
    }
  }, false);
})();
