/* ═══════════════════════════════════════════
   FIELDTRACK v5 — db.js
   IndexedDB photo storage
   Key scheme:
     "full_{photoId}"  → JPEG compressed ≤1200px
     "thumb_{photoId}" → JPEG compressed ≤200px (shown inline)
═══════════════════════════════════════════ */
var FT_DB = (function(){
  var DB_NAME='fieldtrack_photos', DB_VER=1, STORE='photos';
  var _db=null, _queue=[], _opening=false;

  function open(cb){
    if(_db){ cb(null,_db); return; }
    _queue.push(cb);
    if(_opening) return;
    _opening=true;
    var req=indexedDB.open(DB_NAME,DB_VER);
    req.onupgradeneeded=function(e){ var d=e.target.result; if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE,{keyPath:'key'}); };
    req.onsuccess=function(e){ _db=e.target.result; _opening=false; var q=_queue.splice(0); q.forEach(function(fn){ fn(null,_db); }); };
    req.onerror=function(e){ _opening=false; var q=_queue.splice(0); q.forEach(function(fn){ fn(e.target.error); }); };
  }

  function set(key,data,cb){
    open(function(err,d){
      if(err){ if(cb) cb(err); return; }
      try{
        var tx=d.transaction(STORE,'readwrite');
        tx.objectStore(STORE).put({key:key,data:data});
        tx.oncomplete=function(){ if(cb) cb(null); };
        tx.onerror=function(e){ if(cb) cb(e.target.error); };
      }catch(e){ if(cb) cb(e); }
    });
  }

  function get(key,cb){
    open(function(err,d){
      if(err){ cb(err,null); return; }
      try{
        var tx=d.transaction(STORE,'readonly');
        var req=tx.objectStore(STORE).get(key);
        req.onsuccess=function(){ cb(null, req.result?req.result.data:null); };
        req.onerror=function(e){ cb(e.target.error,null); };
      }catch(e){ cb(e,null); }
    });
  }

  function del(key,cb){
    open(function(err,d){
      if(err){ if(cb) cb(err); return; }
      try{
        var tx=d.transaction(STORE,'readwrite');
        tx.objectStore(STORE).delete(key);
        tx.oncomplete=function(){ if(cb) cb(null); };
      }catch(e){ if(cb) cb(e); }
    });
  }

  function delMany(keys,cb){
    open(function(err,d){
      if(err){ if(cb) cb(err); return; }
      try{
        var tx=d.transaction(STORE,'readwrite');
        var store=tx.objectStore(STORE);
        keys.forEach(function(k){ store.delete('full_'+k); store.delete('thumb_'+k); });
        tx.oncomplete=function(){ if(cb) cb(null); };
      }catch(e){ if(cb) cb(e); }
    });
  }

  function clearAll(cb){
    open(function(err,d){
      if(err){ if(cb) cb(err); return; }
      var tx=d.transaction(STORE,'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete=function(){ if(cb) cb(null); };
    });
  }

  function countBytes(cb){
    open(function(err,d){
      if(err){ cb(err,0); return; }
      var tx=d.transaction(STORE,'readonly');
      var req=tx.objectStore(STORE).getAll();
      req.onsuccess=function(){
        var total=0;
        (req.result||[]).forEach(function(r){ total+=(r.data||'').length; });
        cb(null,total);
      };
      req.onerror=function(){ cb(null,0); };
    });
  }

  /* Resize image to maxDim, return jpeg dataURL */
  function resize(img,maxDim,quality){
    var w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
    if(w>maxDim||h>maxDim){
      if(w>h){ h=Math.round(h*maxDim/w); w=maxDim; }
      else { w=Math.round(w*maxDim/h); h=maxDim; }
    }
    var c=document.createElement('canvas');
    c.width=w; c.height=h;
    c.getContext('2d').drawImage(img,0,0,w,h);
    return c.toDataURL('image/jpeg',quality||0.82);
  }

  /*
   * processAndStore(file, photoId, callback(err, thumbDataUrl))
   * Reads file → resizes → stores full + thumb in IDB → returns thumb data so
   * the UI can display it immediately without a second async read.
   */
  function processAndStore(file, photoId, cb){
    var reader=new FileReader();
    reader.onerror=function(){ cb(new Error('Cannot read file')); };
    reader.onload=function(e){
      var img=new Image();
      img.onerror=function(){ cb(new Error('Cannot decode image')); };
      img.onload=function(){
        var fullData  = resize(img,1200,0.85);
        var thumbData = resize(img,220,0.80);
        var pending=2;
        function done(){ if(--pending===0) cb(null, thumbData); }
        set('full_'+photoId, fullData, done);
        set('thumb_'+photoId, thumbData, done);
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function getThumb(photoId,cb){ get('thumb_'+photoId,cb); }
  function getFull(photoId,cb){ get('full_'+photoId,cb); }

  // Store a base64 data URL directly (e.g. client photo from booking form)
  function storeRaw(photoId, dataUrl, cb){
    var pending=2;
    function done(){ if(--pending===0 && cb) cb(); }
    // Store as both full and thumb (already compressed by book.html)
    set('full_'+photoId, dataUrl, done);
    set('thumb_'+photoId, dataUrl, done);
  }

  return { processAndStore, storeRaw, getThumb, getFull, del, delMany, clearAll, countBytes };
})();
