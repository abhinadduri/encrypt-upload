function onChange(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    // The file's text will be printed here
    let self = this;
    window.crypto.subtle.generateKey({
      name: "AES-CBC",
      length: 256 
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"])
    .then(function(key){
      //returns a key object
      var arrayBuffer = self.result;
      // array = new Uint8Array(arrayBuffer),
      // binaryString = String.fromCharCode.apply(null, array);

      // console.log(binaryString);
      // console.log(file);

      var random_iv = window.crypto.getRandomValues(new Uint8Array(16));

      window.crypto.subtle.encrypt({
        name: "AES-CBC",
        //Don't re-use initialization vectors!
        //Always generate a new iv every time your encrypt!
        iv: random_iv},
        key, //from generateKey or importKey above
        arrayBuffer //ArrayBuffer of data you want to encrypt
        )
        .then(function(encrypted){
          console.log(String.fromCharCode.apply(null, new Uint16Array(random_iv)));
        //returns an ArrayBuffer containing the encrypted data
          var dataView = new DataView(encrypted);
          var blob = new Blob([dataView], { type: file.type });
          var fd = new FormData();
          fd.append('fname', file.name);
          fd.append('data', blob, file.name);
          // console.log(blob);
          var xhr = new XMLHttpRequest();

          xhr.open('post', '/upload', true);
          xhr.onreadystatechange = function() { 
            // console.log('success');
          };

          xhr.send(fd);
        })
        .catch(function(err){
          console.error(err);
        });


      window.crypto.subtle.exportKey(
        "jwk", //can be "jwk" or "raw"
        key)
        .then(function(keydata){
          //returns the exported key data
          alert(keydata.k);

        })
        .catch(function(err){
          console.error(err);
        });
      })
    .catch(function(err){
        console.error(err);
    });

    
  };

  reader.readAsArrayBuffer(file);
}

