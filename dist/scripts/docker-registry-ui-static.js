/*!
 * docker-registry-ui
 * Copyright (C) 2016-2019  Jones Magloire @Joxit
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const Crypto=window.crypto||window.msCrypto;function Http(){this.oReq=new XMLHttpRequest,this.oReq.hasHeader=Http.hasHeader,this.oReq.getErrorMessage=Http.getErrorMessage,this._events={},this._headers={}}Http.prototype.getContentDigest=function(t){const e=this.oReq.getAllResponseHeaders(),i=e.indexOf('etag: "sha256:');-1!==i?t(e.slice(i+7,e.indexOf('"',i+7))):Crypto.subtle.digest("SHA-256",(new TextEncoder).encode(this.oReq.responseText)).then(function(e){t("sha256:"+Array.from(new Uint8Array(e)).map(t=>t.toString(16).padStart(2,"0")).join(""))})},Http.prototype.addEventListener=function(t,e){this._events[t]=e;const i=this;switch(t){case"loadend":i.oReq.addEventListener("loadend",function(){if(401==this.status){const t=new XMLHttpRequest;for(key in t.open(i._method,i._url),i._events)t.addEventListener(key,i._events[key]);for(key in i._headers)t.setRequestHeader(key,i._headers[key]);t.withCredentials=!0,t.hasHeader=Http.hasHeader,t.getErrorMessage=Http.getErrorMessage,t.send()}else e.bind(this)()});break;case"load":i.oReq.addEventListener("load",function(){401!==this.status&&e.bind(this)()});break;default:i.oReq.addEventListener(t,function(){e.bind(this)()})}},Http.prototype.setRequestHeader=function(t,e){this.oReq.setRequestHeader(t,e),this._headers[t]=e},Http.prototype.open=function(t,e){this._method=t,this._url=e,this.oReq.open(t,e)},Http.prototype.send=function(){this.oReq.send()},Http.hasHeader=function(t){return this.getAllResponseHeaders().split("\n").some(function(e){return new RegExp("^"+t+":","i").test(e)})},Http.getErrorMessage=function(){return registryUI.url()&&registryUI.url().match("^http://")&&"https:"===window.location.protocol?"Mixed Content: The page at `"+window.location.origin+"` was loaded over HTTPS, but requested an insecure server endpoint `"+registryUI.url()+"`. This request has been blocked; the content must be served over HTTPS.":registryUI.url()?this.withCredentials&&!this.hasHeader("Access-Control-Allow-Credentials")?"The `Access-Control-Allow-Credentials` header in the response is missing and must be set to `true` when the request's credentials mode is on. Origin `"+registryUI.url()+"` is therefore not allowed access.":"An error occured: Check your connection and your registry must have `Access-Control-Allow-Origin` header set to `"+window.location.origin+"`":"Incorrect server endpoint."};var registryUI={url:function(){var t="${URL}";return t||((t=window.location.origin+window.location.pathname).endsWith("/")?t.substr(0,t.length-1):t)},name:function(){const t="${REGISTRY_TITLE}";return t},pullUrl:"${PULL_URL}",isImageRemoveActivated:!0,catalog:{},taglist:{},taghistory:{}};window.addEventListener("DOMContentLoaded",function(){riot.mount("*")}),registryUI.bytesToSize=function(t){if(null==t||isNaN(t))return"?";if(0==t)return"0 Byte";const e=parseInt(Math.floor(Math.log(t)/Math.log(1024)));return Math.ceil(t/Math.pow(1024,e))+" "+["Bytes","KB","MB","GB","TB"][e]},registryUI.dateFormat=function(t){if(void 0===t)return"";const e=["a second","seconds","a minute","minutes","an hour","hours","a day","days","a month","months","a year","years"],i=[1,60,3600,86400,2592e3,31104e3,1/0],r=(new Date-t)/1e3;for(var a=0;a<i.length-1;a++){if(2*i[a]>=r)return e[2*a];if(i[a+1]>r)return Math.floor(r/i[a])+" "+e[2*a+1]}},registryUI.getHistoryIcon=function(t){switch(t){case"architecture":return"memory";case"created":return"event";case"docker_version":return"";case"os":return"developer_board";case"Cmd":return"launch";case"Entrypoint":return"input";case"Env":return"notes";case"Labels":return"label";case"User":return"face";case"Volumes":return"storage";case"WorkingDir":return"home";case"author":return"account_circle";case"id":case"digest":return"settings_ethernet";case"created_by":return"build";case"size":return"get_app";case"ExposedPorts":return"router"}},registryUI.getPage=function(t,e,i){return i||(i=100),t?t.slice((e-1)*i,i*e):[]},registryUI.getNumPages=function(t,e){return e||(e=100),t?Math.trunc(t.length/e)+1:0},registryUI.getPageLabels=function(t,e){var i=[];if(1===e)return i;1!==t&&e>=10&&(i.push({icon:"first_page",page:1}),i.push({icon:"chevron_left",page:t-1}));for(var r=Math.round(Math.max(1,Math.min(t-5,e-10+1))),a=r;a<Math.min(e+1,r+10);a++)i.push({page:a,current:a===t,"space-left":1===t&&e>10,"space-right":t===e&&e>10});return t!==e&&e>=10&&(i.push({icon:"chevron_right",page:t+1}),i.push({icon:"last_page",page:e})),i},registryUI.updateQueryString=function(t){var e="";for(var i in t)void 0!==t[i]&&(e+=(e.length>0?"&":"?")+i+"="+t[i]);history.pushState(null,"",e+window.location.hash)},registryUI.stripHttps=function(t){return t?t.replace(/^https?:\/\//,""):""},riot.tag2("app",'<header> <material-navbar> <div class="logo">Docker Registry UI</div> <menu></menu> </material-navbar> </header> <main> <catalog if="{route.routeName == \'home\'}"></catalog> <taglist if="{route.routeName == \'taglist\'}"></taglist> <tag-history if="{route.routeName == \'taghistory\'}"></tag-history> <change></change> <add></add> <remove></remove> <material-snackbar></material-snackbar> </main> <footer> <material-footer> <a class="material-footer-logo" href="https://joxit.github.io/docker-registry-ui/">Docker Registry UI v1.3.0</a> <ul class="material-footer-link-list"> <li> <a href="https://github.com/Joxit/docker-registry-ui">Contribute on GitHub</a> </li> <li> <a href="https://github.com/Joxit/docker-registry-ui/blob/master/LICENSE">Privacy &amp; Terms</a> </li> </ul> </material-footer> </footer>',"","",function(t){registryUI.appTag=this,route.base("#!"),route("",function(){route.routeName="home",registryUI.catalog.display&&(registryUI.catalog.loadend=!1),registryUI.appTag.update()}),route("/taglist/*",function(t){route.routeName="taglist",registryUI.taglist.name=t,registryUI.taglist.display&&(registryUI.taglist.loadend=!1),registryUI.appTag.update()}),route("/taghistory/image/*/tag/*",function(t,e){route.routeName="taghistory",registryUI.taghistory.image=t,registryUI.taghistory.tag=e,registryUI.taghistory.display&&(registryUI.taghistory.loadend=!1),registryUI.appTag.update()}),registryUI.home=function(){"home"==route.routeName?registryUI.catalog.display:route("")},registryUI.taghistory.go=function(t,e){route("/taghistory/image/"+t+"/tag/"+e)},registryUI.snackbar=function(t,e){registryUI.appTag.tags["material-snackbar"].addToast({message:t,isError:e},15e3)},registryUI.errorSnackbar=function(t){return registryUI.snackbar(t,!0)},registryUI.cleanName=function(){const t=registryUI.pullUrl||registryUI.url()&&registryUI.url().length>0&&registryUI.url()||window.location.host;return registryUI.stripHttps(t)},route.parser(null,function(t,e){const i=e.replace(/\?/g,"\\?").replace(/\*/g,"([^?#]+?)").replace(/\.\./,".*"),r=new RegExp("^"+i+"$"),a=t.match(r);if(a)return a.slice(1)}),registryUI.isDigit=function(t){return t>="0"&&t<="9"},registryUI.DockerImage=function(t,e){this.name=t,this.tag=e,riot.observable(this),this.on("get-size",function(){return void 0!==this.size?this.trigger("size",this.size):this.fillInfo()}),this.on("get-sha256",function(){return void 0!==this.size?this.trigger("sha256",this.sha256):this.fillInfo()}),this.on("get-date",function(){return void 0!==this.creationDate?this.trigger("creation-date",this.creationDate):this.fillInfo()}),this.on("get-content-id",function(){return void 0!==this.id?this.trigger("content-id",this.id):this.fillInfo()})},registryUI.DockerImage._tagReduce=function(t,e){return t.length>0&&registryUI.isDigit(t[t.length-1].charAt(0))==registryUI.isDigit(e)?t[t.length-1]+=e:t.push(e),t},registryUI.DockerImage.compare=function(t,e){const i=t.tag.match(/./g).reduce(registryUI.DockerImage._tagReduce,[]),r=e.tag.match(/./g).reduce(registryUI.DockerImage._tagReduce,[]);for(var a=0;a<i.length&&a<r.length;a++){const t=i[a].localeCompare(r[a]);if(registryUI.isDigit(i[a].charAt(0))&&registryUI.isDigit(r[a].charAt(0))){const t=i[a]-r[a];if(0!=t)return t}else if(0!=t)return t}return t.tag.length-e.tag.length},registryUI.DockerImage.prototype.fillInfo=function(){if(this._fillInfoWaiting)return;this._fillInfoWaiting=!0;const t=new Http,e=this;t.addEventListener("loadend",function(){if(200==this.status||202==this.status){const i=JSON.parse(this.responseText);e.size=i.layers.reduce(function(t,e){return t+e.size},0),e.sha256=i.config.digest,e.layers=i.layers,e.trigger("size",e.size),e.trigger("sha256",e.sha256),t.getContentDigest(function(t){e.id=t,e.trigger("content-id",t)}),e.getBlobs(i.config.digest)}else 404==this.status?registryUI.errorSnackbar("Manifest for "+e.name+":"+e.tag+" not found"):registryUI.snackbar(this.responseText)}),t.open("GET",registryUI.url()+"/v2/"+e.name+"/manifests/"+e.tag),t.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),t.send()},registryUI.DockerImage.prototype.getBlobs=function(t){const e=new Http,i=this;e.addEventListener("loadend",function(){if(200==this.status||202==this.status){const e=JSON.parse(this.responseText);i.creationDate=new Date(e.created),i.blobs=e,i.blobs.history.filter(function(t){return!t.empty_layer}).forEach(function(t,e){t.size=i.layers[e].size,t.id=i.layers[e].digest.replace("sha256:","")}),i.blobs.id=t.replace("sha256:",""),i.trigger("creation-date",i.creationDate),i.trigger("blobs",i.blobs)}else 404==this.status?registryUI.errorSnackbar("Blobs for "+i.name+":"+i.tag+" not found"):registryUI.snackbar(this.responseText)}),e.open("GET",registryUI.url()+"/v2/"+i.name+"/blobs/"+t),e.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),e.send()},registryUI.taglist.go=function(t){route("taglist/"+t)},registryUI.getPageQueryParam=function(){var t=route.query();try{return void 0!==t.page?parseInt(t.page.replace(/#.*/,"")):1}catch(t){return 1}},registryUI.getQueryParams=function(t){var e=route.query();for(var i in t=t||{},e)void 0!==e[i]?e[i]=e[i].replace(/#!.*/,""):delete e[i];for(var i in t)void 0!==t[i]&&(e[i]=t[i]);return e},route.start(!0)}),riot.tag2("catalog-element",'<material-card class="list highlight" item="{item}" expanded="{expanded}"> <material-waves onmousedown="{launch}" center="true" color="#ddd"></material-waves> <span> <i class="material-icons">send</i> {typeof opts.item === ⁗string⁗ ? opts.item : opts.item.repo} <div if="{typeof opts.item !== ⁗string⁗}" class="item-count right"> {opts.item.images && opts.item.images.length} images <i class="material-icons animated {expanded: opts.expanded}">expand_more</i> </div> </span> </material-card> <catalog-element if="{typeof opts.item !== ⁗string⁗}" class="animated {hide: !expanded, expanding: expanding}" each="{item in item.images}"></catalog-element>',"","",function(t){this.on("mount",function(){const t=this,e=this.tags["material-card"];e&&(e.launch=function(t){e.tags["material-waves"].trigger("launch",t)},this.item.images&&1===this.item.images.length&&(this.item=this.item.images[0]),e.root.onclick=function(e){t.item.repo?(t.expanded=!t.expanded,t.update({expanded:t.expanded,expanding:!0}),setTimeout(function(){t.update({expanded:t.expanded,expanding:!1})},50)):registryUI.taglist.go(t.item)})})}),riot.tag2("catalog",'<material-card ref="catalog-tag" class="catalog header"> <div class="material-card-title-action"> <h2> Repositories of {registryUI.name()} <div class="item-count">{registryUI.catalog.length} images</div> </h2> </div> </material-card> <div hide="{registryUI.catalog.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <catalog-element each="{item in registryUI.catalog.repositories}"></catalog-element>',"","",function(t){registryUI.catalog.instance=this,registryUI.catalog.display=function(){registryUI.catalog.repositories=[];const t=new Http;t.addEventListener("load",function(){registryUI.catalog.repositories=[],200==this.status?(registryUI.catalog.repositories=JSON.parse(this.responseText).repositories||[],registryUI.catalog.repositories.sort(),registryUI.catalog.length=registryUI.catalog.repositories.length,registryUI.catalog.repositories=registryUI.catalog.repositories.reduce(function(t,e){const i=e.indexOf("/");if(i>0){const r=e.substring(0,i)+"/";return 0!=t.length&&t[t.length-1].repo==r||t.push({repo:r,images:[]}),t[t.length-1].images.push(e),t}return t.push(e),t},[])):404==this.status?registryUI.snackbar("Server not found",!0):registryUI.snackbar(this.responseText)}),t.addEventListener("error",function(){registryUI.snackbar(this.getErrorMessage(),!0),registryUI.catalog.repositories=[]}),t.addEventListener("loadend",function(){registryUI.url()||(registryUI._url=window.location.origin+window.location.pathname.replace(/\/+$/,"")),registryUI.catalog.loadend=!0,registryUI.catalog.instance.update()}),t.open("GET",registryUI.url()+"/v2/_catalog?n=100000"),t.send()},registryUI.catalog.display()}),riot.tag2("copy-to-clipboard",'<div class="copy-to-clipboard"> <input ref="input" style="display: none; width: 1px; height: 1px;" riot-value="{this.dockerCmd}"> <material-button waves-center="true" rounded="true" waves-color="#ddd" onclick="{this.copy}" title="Copy pull command."> <i class="material-icons">content_copy</i> </material-button> </div>',"","",function(t){this.prefix="docker pull "+registryUI.cleanName()+"/"+t.image.name;const e=this;t.image.on("content-id",function(i){"id"===t.target?e.dockerCmd=e.prefix+"@"+i:e.dockerCmd=e.prefix+":"+t.image.tag,e.update()}),t.image.trigger("get-content-id"),this.copy=function(){const t=this.refs.input;t.style.display="block",t.select(),document.execCommand("copy"),t.style.display="none",registryUI.snackbar("`"+this.dockerCmd+"` has been copied to clipboard.")}}),riot.tag2("image-content-digest",'<div title="{this.title}">{this.display_id}</div>',"","",function(t){const e=this;t.image.on("content-id",function(t){e.id=t,e.onResize(),window.addEventListener("resize",e.onResize),window.addEventListener("load",e.onResize)}),e.onResize=function(){if(window.innerWidth>=1432)e.display_id=e.id,e.title="";else if(window.innerWidth<1024)e.display_id="",e.title=e.id;else{let t=(window.innerWidth-1024)/416;e.display_id=e.id.slice(0,15+56*t)+"...",e.title=e.id}e.update()},t.image.trigger("get-content-id")}),riot.tag2("image-date",'<div title="Creation date {this.localDate}">{registryUI.dateFormat(this.date)} ago</div>',"","",function(t){const e=this;t.image.on("creation-date",function(t){e.date=t,e.localDate=t.toLocaleString(),e.update()}),t.image.trigger("get-date")}),riot.tag2("image-size",'<div title="Compressed size of your image.">{registryUI.bytesToSize(this.size)}</div>',"","",function(t){const e=this;t.image.on("size",function(t){e.size=t,e.update()}),t.image.trigger("get-size")}),riot.tag2("image-tag",'<div title="{this.sha256}">{opts.image.tag}</div>',"","",function(t){const e=this;t.image.on("sha256",function(t){e.sha256=t.substring(0,19),e.update()}),t.image.trigger("get-sha256")}),riot.tag2("pagination",'<div class="conatianer"> <div class="pagination-centered"> <material-button waves-color="rgba(158,158,158,.4)" each="{p in this.opts.pages}" class="{current: p.current, space-left: p[\'space-left\'], space-right: p[\'space-right\']}"> <i show="{p.icon}" class="material-icons">{p.icon}</i> <div hide="{p.icon}">{p.page}</div> </material-button> </div> <div>',"","",function(t){this.on("updated",function(){this.tags["material-button"]&&(Array.isArray(this.tags["material-button"])?this.tags["material-button"]:[this.tags["material-button"]]).forEach(function(t){t.root.onclick=function(){registryUI.taglist.instance.trigger("page-update",t.p.page)}})})}),riot.tag2("remove-image",'<material-button waves-center="true" rounded="true" waves-color="#ddd" title="This will delete the image." if="{!opts.multiDelete}"> <i class="material-icons">delete</i> </material-button> <material-checkbox if="{opts.multiDelete}" title="Select this tag to delete it."></material-checkbox>',"","",function(t){const e=this;this.on("updated",function(){}),this.on("updated",function(){e.multiDelete!=e.opts.multiDelete&&(this.tags["material-button"]&&(this.delete=this.tags["material-button"].root.onclick=function(t){const i=e.opts.image.name,r=e.opts.image.tag,a=new Http;a.addEventListener("loadend",function(){if(registryUI.taglist.go(i),200==this.status){if(!this.hasHeader("Docker-Content-Digest"))return void registryUI.errorSnackbar("You need to add Access-Control-Expose-Headers: ['Docker-Content-Digest'] in your server configuration.");const e=this.getResponseHeader("Docker-Content-Digest"),a=new Http;a.addEventListener("loadend",function(){200==this.status||202==this.status?(registryUI.taglist.display(),registryUI.snackbar("Deleting "+i+":"+r+" image. Run `registry garbage-collect config.yml` on your registry")):404==this.status?t||registryUI.errorSnackbar("Digest not found"):registryUI.snackbar(this.responseText)}),a.open("DELETE",registryUI.url()+"/v2/"+i+"/manifests/"+e),a.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),a.addEventListener("error",function(){registryUI.errorSnackbar("An error occurred when deleting image. Check if your server accept DELETE methods Access-Control-Allow-Methods: ['DELETE'].")}),a.send()}else 404==this.status?registryUI.errorSnackbar("Manifest for "+i+":"+r+" not found"):registryUI.snackbar(this.responseText)}),a.open("HEAD",registryUI.url()+"/v2/"+i+"/manifests/"+r),a.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),a.send()}),this.tags["material-checkbox"]&&(!this.opts.multiDelete&&this.tags["material-checkbox"].checked&&this.tags["material-checkbox"].toggle(),this.tags["material-checkbox"].on("toggle",function(){registryUI.taglist.instance.trigger("toggle-remove-image",this.checked)})),e.multiDelete=e.opts.multiDelete)})}),riot.tag2("tag-history-button",'<material-button ref="button" title="This will show the history of given tag" waves-center="true" rounded="true" waves-color="#ddd"> <i class="material-icons">history</i> </material-button>',"","",function(t){this.on("mount",function(){const t=this;this.refs.button.root.onclick=function(){registryUI.taghistory._image=t.opts.image,registryUI.taghistory.go(t.opts.image.name,t.opts.image.tag)}}),this.update()}),riot.tag2("tag-history-element",'<div class="headline"><i class="material-icons">{registryUI.getHistoryIcon(entry.key)}</i> <p>{entry.key.replace(\'_\', \' \')}</p> </div> <div class="value" if="{!(entry.value instanceof Array)}"> {entry.value}</div> <div class="value" each="{e in entry.value}" if="{entry.value instanceof Array}"> {e}</div>',"",'class="{entry.key}"',function(t){}),riot.tag2("tag-history",'<material-card ref="tag-history-tag" class="tag-history header"> <div class="material-card-title-action"> <material-button waves-center="true" rounded="true" waves-color="#ddd"> <i class="material-icons">arrow_back</i> </material-button> <h2> History of {registryUI.taghistory.image}:{registryUI.taghistory.tag} <i class="material-icons">history</i> </h2> </div> </material-card> <div hide="{registryUI.taghistory.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <material-card each="{guiElement in this.elements}" class="tag-history-element"> <tag-history-element each="{entry in guiElement}" if="{entry.value && entry.value.length > 0}"></tag-history-element> </material-card>',"","",function(t){const e=this,i=function(t){switch(t){case"id":return 1;case"created":return 2;case"created_by":return 3;case"size":return 4;case"os":return 5;case"architecture":return 6;case"linux":return 7;case"docker_version":return 8;default:return 10}},r=function(t,e){return i(t.key)-i(e.key)},a=function(t,e){switch(t){case"created":return new Date(e).toLocaleString();case"created_by":const i=e.match(/\/bin\/sh *-c *#\(nop\) *([A-Z]+)/);return i&&i[1]||"RUN";case"size":return registryUI.bytesToSize(e);case"Entrypoint":case"Cmd":return(e||[]).join(" ");case"Labels":return Object.keys(e||{}).map(function(t){return e[t]?t+"="+e[t]:""});case"Volumes":case"ExposedPorts":return Object.keys(e)}return e||""},s=function(t){function i(t){const e=[];for(const i in t)if(t.hasOwnProperty(i)&&"empty_layer"!=i){const r=t[i],s={key:i,value:a(i,r)};e.push(s)}return e.sort(r)}e.elements.push(i(function(t){const e=["architecture","User","created","docker_version","os","Cmd","Entrypoint","Env","Labels","User","Volumes","WorkingDir","author","id","ExposedPorts"].reduce(function(e,i){const r=t[i]||t.config[i];return r&&(e[i]=r),e},{});return!e.author&&e.Labels&&e.Labels.maintainer&&(e.author=t.config.Labels.maintainer,delete e.Labels.maintainer),e}(t))),t.history.reverse().forEach(function(t){e.elements.push(i(t))}),registryUI.taghistory.loadend=!0,e.update()};registryUI.taghistory.display=function(){e.elements=[];const t=registryUI.taghistory._image&&registryUI.taghistory._image.blobs;if(t)return window.scrollTo(0,0),s(t);const i=new registryUI.DockerImage(registryUI.taghistory.image,registryUI.taghistory.tag);i.fillInfo(),i.on("blobs",s)},this.on("mount",function(){e.refs["tag-history-tag"].tags["material-button"].root.onclick=function(){registryUI.taglist.go(registryUI.taghistory.image)}}),registryUI.taghistory.display(),e.update()}),riot.tag2("taglist",'<material-card class="header"> <div class="material-card-title-action "> <material-button waves-center="true" rounded="true" waves-color="#ddd" onclick="registryUI.home();"> <i class="material-icons">arrow_back</i> </material-button> <h2> Tags of {registryUI.taglist.name} <div class="source-hint"> Sourced from {registryUI.name() + \'/\' + registryUI.taglist.name} </div> <div class="item-count">{registryUI.taglist.tags.length} tags</div> </h2> </div> </material-card> <div hide="{registryUI.taglist.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <pagination pages="{registryUI.getPageLabels(this.page, registryUI.getNumPages(registryUI.taglist.tags))}"></pagination> <material-card ref="taglist-tag" class="taglist" multi-delete="{this.multiDelete}" tags="{registryUI.getPage(registryUI.taglist.tags, this.page)}" show="{registryUI.taglist.loadend}"> <table show="{registryUI.taglist.loadend}" style="border: none;"> <thead> <tr> <th>Creation date</th> <th>Size</th> <th id="image-content-digest-header">Content Digest</th> <th id="image-tag-header" class="{registryUI.taglist.asc ? \'material-card-th-sorted-ascending\' : \'material-card-th-sorted-descending\'}" onclick="registryUI.taglist.reverse();">Tag </th> <th class="show-tag-history">History</th> <th class="{\'remove-tag\': true, delete: this.parent.toDelete > 0}" if="{registryUI.isImageRemoveActivated}"> <material-checkbox ref="remove-tag-checkbox" class="indeterminate" show="{this.toDelete === 0}" title="Toggle multi-delete. Alt+Click to select all tags."></material-checkbox> <material-button waves-center="true" rounded="true" waves-color="#ddd" title="This will delete selected images." onclick="{registryUI.taglist.bulkDelete}" show="{this.toDelete > 0}"> <i class="material-icons">delete</i> </material-button></th> </tr> </thead> <tbody> <tr each="{image in this.opts.tags}"> <td> <image-date image="{image}"></image-date> </td> <td> <image-size image="{image}"></image-size> </td> <td> <image-content-digest image="{image}"></image-content-digest> <copy-to-clipboard target="id" image="{image}"></copy-to-clipboard> </td> <td> <image-tag image="{image}"></image-tag> <copy-to-clipboard target="tag" image="{image}"></copy-to-clipboard> </td> <td class="show-tag-history"> <tag-history-button image="{image}"></tag-history-button> </td> <td if="{registryUI.isImageRemoveActivated}"> <remove-image multi-delete="{this.opts.multiDelete}" image="{image}"></remove-image> </td> </tr> </tbody> </table> </material-card> <pagination pages="{registryUI.getPageLabels(this.page, registryUI.getNumPages(registryUI.taglist.tags))}"></pagination>',"","",function(t){var e=registryUI.taglist.instance=this;e.page=registryUI.getPageQueryParam(),this.multiDelete=!1,this.toDelete=0,this.on("delete",function(){registryUI.isImageRemoveActivated&&this.multiDelete}),this.on("multi-delete",function(){registryUI.isImageRemoveActivated&&(this.multiDelete=!this.multiDelete)}),this.on("toggle-remove-image",function(t){t?this.toDelete++:this.toDelete--,this.toDelete<=1&&this.update()}),this.on("page-update",function(t){e.page=t<1?1:t,registryUI.updateQueryString(registryUI.getQueryParams({page:e.page})),this.toDelete=0,this.update()}),this._getRemoveImageTags=function(){var t=e.refs["taglist-tag"].tags["remove-image"];return t instanceof Array||(t=[t]),t},registryUI.taglist.bulkDelete=function(){e.multiDelete&&e.toDelete>0&&e._getRemoveImageTags().filter(function(t){return t.tags["material-checkbox"].checked}).forEach(function(t){t.delete(!0)})},this.on("update",function(){var t=this.refs["taglist-tag"].refs["remove-tag-checkbox"];t&&!t._toggle&&(t._toggle=t.toggle,t.toggle=function(t){t.altKey?e._getRemoveImageTags().filter(function(t){return!t.tags["material-checkbox"].checked}).forEach(function(t){t.tags["material-checkbox"].toggle()}):this._toggle()},t.on("toggle",function(){registryUI.taglist.instance.multiDelete=this.checked,registryUI.taglist.instance.update()}))}),registryUI.taglist.display=function(){if(registryUI.taglist.tags=[],"taglist"==route.routeName){const t=new Http;registryUI.taglist.instance.update(),t.addEventListener("load",function(){registryUI.taglist.tags=[],200==this.status?(registryUI.taglist.tags=JSON.parse(this.responseText).tags||[],registryUI.taglist.tags=registryUI.taglist.tags.map(function(t){return new registryUI.DockerImage(registryUI.taglist.name,t)}).sort(registryUI.DockerImage.compare),e.trigger("page-update",Math.min(e.page,registryUI.getNumPages(registryUI.taglist.tags)))):404==this.status?registryUI.snackbar("Server not found",!0):registryUI.snackbar(this.responseText,!0)}),t.addEventListener("error",function(){registryUI.snackbar(this.getErrorMessage(),!0),registryUI.taglist.tags=[]}),t.addEventListener("loadend",function(){registryUI.taglist.loadend=!0,registryUI.taglist.instance.update()}),t.open("GET",registryUI.url()+"/v2/"+registryUI.taglist.name+"/tags/list"),t.send(),registryUI.taglist.asc=!0}},registryUI.taglist.display(),registryUI.taglist.instance.update(),registryUI.taglist.reverse=function(){registryUI.taglist.asc?(registryUI.taglist.tags.reverse(),registryUI.taglist.asc=!1):(registryUI.taglist.tags.sort(registryUI.DockerImage.compare),registryUI.taglist.asc=!0),registryUI.taglist.instance.update()}});