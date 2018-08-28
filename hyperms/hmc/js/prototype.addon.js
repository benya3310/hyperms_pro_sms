/**
 * @author Tzury
 */


/**

SAMPLE OF USGAE

// the trick is to work on the prototype

actsAsDecorator(Ajax.InPlaceEditor.prototype);
Ajax.InPlaceEditor.prototype.after('enterEditMode', function() { alert('hi') });


// here we just work on the instance

var ipe = new Ajax.InPlaceEditor(...);
actsAsDecorator(ipe);
ipe.before('enterEditMode', function() { alert('hello') });

**/



function actsAsDecorator(object) {
  object.setupDecoratorFor = function(method) {
    if (! ('original_' + method in object) ) {
      object['original_' + method] = object[method];
      object['before_' + method]   = [ ];
      object['after_' + method]    = [ ];
      object[method] = function() {
        var i;
        var b = this['before_' + method];
        var a = this['after_'  + method];
        var rv;
        for (i = 0; i < b.length; i++) {
          b[i].call(this, arguments);
        }
        rv = this['original_' + method](arguments);
        for (i = 0; i < a.length; i++) {
          a[i].call(this, arguments);
        }
        return rv;
      }
    }
  };
  object.before = function(method, f) {
    object.setupDecoratorFor(method);
    object['before_' + method].unshift(f);
  };
  object.after = function(method, f) {
    object.setupDecoratorFor(method);
    object['after_' + method].push(f);
  };
}


Element.removeChildren = function (element){   
      this.update(element,'');
};





/*
ADDED FUNCTION : $New
creates new dom element
*/

function $New(typeName, id , className, evtName, observer, useCapture){
    if (typeName){
    
        var elem = document.createElement(typeName);
            
        if (id) elem.setAttribute("id",id);
        
        if (className) elem.className= className;
        
        if (evtName) Event.observe(elem, evtName, observer, useCapture); 
        
        return elem;
    }
    else{
        return null;
    }
}
function newElem(elem){
                if (elem.tagName ){
                var ret = document.createElement(elem.tagName);
                if (elem.attr){
                    attr = elem.attr ;
                    for (a in attr){
                        if (a !== 'class'){ret.setAttribute(a, attr[a]);}
                        else{ret.className = attr[a];}
                    }
                }
                if (elem.child){
                    if (typeof(elem.child) === "string"){ ret.innerHTML = elem.child; }
                    else if (typeof( elem.child) === "object"){
                        for (x=0; x < elem.child.length; x++){
                            ret.appendChild(newElem(elem.child[x]));
                        }
                    }
                }
                return ret;
                }
            }



String.prototype.format = function (){
    
    var ret = arguments[0];
    for(var i=1; i < arguments.length; ++i) {
        ret = ret.replace("{" + (i-1).toString() + "}", arguments[i]);
    }
    return ret;
}
