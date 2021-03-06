describe("LSD.ChildNodes", function() {
  describe("when given objects", function() {
    it ("should update length", function() {
      var children = new LSD.ChildNodes;
      var a = new LSD.Object;
      var b = new LSD.Object;
      expect(children.length).toEqual(0);
      children.push(a);
      expect(children[0]).toEqual(a);
      expect(children.length).toEqual(1);
      children.push(b);
      expect(children[1]).toEqual(b);
      expect(children.length).toEqual(2);
    });
    describe("when objects are observable objects", function() {
      it ("should make the inserted objects link to previous and next object", function() {
        var children = new LSD.ChildNodes;
        var a = new LSD.Object;
        var b = new LSD.Object;
        var c = new LSD.Object;
        var d = new LSD.Object;
        expect(children.length).toEqual(0);
        expect(a.nextSibling).toBeUndefined();
        expect(a.previousSibling).toBeUndefined();
        children.push(a); //a
        expect(a.nextSibling).toBeNull();
        expect(a.previousSibling).toBeNull();
        children.push(b); //ab
        expect(a.nextSibling).toBe(b);
        expect(a.previousSibling).toBeNull();
        expect(b.nextSibling).toBeNull();
        expect(b.previousSibling).toBe(a);
        children.push(c); //abc
        expect(a.nextSibling).toBe(b);
        expect(a.previousSibling).toBeNull();
        expect(b.nextSibling).toBe(c);
        expect(b.previousSibling).toBe(a);
        expect(c.nextSibling).toBeNull();
        expect(c.previousSibling).toEqual(b);
        children.unshift(d); //dabc
        expect(a.nextSibling).toBe(b);
        expect(a.previousSibling).toEqual(d);
        expect(b.nextSibling).toBe(c);
        expect(b.previousSibling).toEqual(a);
        expect(c.nextSibling).toBeNull();
        expect(c.previousSibling).toEqual(b);
        expect(d.nextSibling).toBe(a);
        expect(d.previousSibling).toBeNull();
        children.splice(children.indexOf(b), 1); //dac
        expect(a.nextSibling).toBe(c);
        expect(a.previousSibling).toBe(d);
        expect(b.nextSibling).toBeUndefined();
        expect(b.previousSibling).toBeUndefined();
        expect(c.nextSibling).toBeNull();
        expect(c.previousSibling).toBe(a);
        expect(d.nextSibling).toBe(a);
        expect(d.previousSibling).toBeNull();
        children.pop(); //da
        expect(a.nextSibling).toBeNull()
        expect(a.previousSibling).toEqual(d);
        expect(c.nextSibling).toBeUndefined();
        expect(c.previousSibling).toBeUndefined();
        expect(d.nextSibling).toEqual(a);
        expect(d.previousSibling).toBeNull();
        children.shift(); //a
        expect(a.nextSibling).toBeNull()
        expect(a.previousSibling).toBeNull();
        expect(d.nextSibling).toBeUndefined();
        expect(d.previousSibling).toBeUndefined();
        children.shift(); //<empty>
        expect(a.nextSibling).toBeUndefined()
        expect(a.previousSibling).toBeUndefined();
      });
      it ("should maintain first/last links", function() {
        var children = new LSD.ChildNodes;
        var object = new LSD.Object({children: children})
        var a = new LSD.Object({id: 'a'});
        var b = new LSD.Object({id: 'b'});;
        var c = new LSD.Object({id: 'c'});;
        var d = new LSD.Object({id: 'd'});;
        expect(object.firstChild).toBeUndefined();
        expect(object.lastChild).toBeUndefined();
        children.push(a); //a
        expect(object.firstChild).toEqual(a);
        expect(object.lastChild).toEqual(a);
        children.unshift(b); //ba
        expect(object.firstChild).toEqual(b);
        expect(object.lastChild).toEqual(a);
        children.splice(1, 0, c); //bac
        expect(object.firstChild).toEqual(b);
        expect(object.lastChild).toEqual(a);
        children.push(d); //bacd
        expect(object.firstChild).toEqual(b);
        expect(object.lastChild).toEqual(d);
        children.shift(); //cad
        expect(object.firstChild).toEqual(c);
        expect(object.lastChild).toEqual(d);
        children.shift(); //ad
        expect(object.firstChild).toEqual(a);
        expect(object.lastChild).toEqual(d);
        children.pop(); //a
        expect(object.firstChild).toEqual(a);
        expect(object.lastChild).toEqual(a);
        children.pop(); //
        expect(object.firstChild).toBeUndefined();
        expect(object.lastChild).toBeUndefined();
      });
      it ("should maintain parentNode link on each item of the array", function() {
        var children = new LSD.ChildNodes;
        var widget = new LSD.Object({
          childNodes: children
        });
        var a = new LSD.Object({id: 'a'});
        var b = new LSD.Object({id: 'b'});
        var c = new LSD.Object({id: 'c'});
        expect(a.parentNode).toBeUndefined()
        children.push(a);
        expect(a.parentNode).toEqual(widget)
        children.push(b);
        expect(b.parentNode).toEqual(widget)
        children.unshift(c);
        expect(c.parentNode).toEqual(widget)
        children.pop();
        expect(b.parentNode).toBeUndefined();
        children.pop();
        expect(a.parentNode).toBeUndefined();
        children.pop();
        expect(c.parentNode).toBeUndefined();
        children.push(c);
        expect(c.parentNode).toEqual(widget)
        children.shift();
        expect(c.parentNode).toBeUndefined();
      })
      it ("should maintain links when splicing long fragments", function() {
        var children = new LSD.ChildNodes;
        var widget = new LSD.Object({
          childNodes: children
        });
        var a = new LSD.Object({id: 'a'});
        var b = new LSD.Object({id: 'b'});
        var c = new LSD.Object({id: 'c'});
        var d = new LSD.Object({id: 'd'});
        var e = new LSD.Object({id: 'e'});
        var ap = 0, an = 0;
        a.watch('previousSibling', function(value, old) { ap += value ? 1 : -1; })
        children.push(a, e);
        expect(a.nextSibling).toBe(e);
        expect(e.previousSibling).toBe(a);
        expect(a.nextSibling).toBe(e);
        expect(e.previousSibling).toBe(a);
        children.splice(1, 0, b, c, d)
        expect(a.nextSibling).toBe(b);
        expect(b.previousSibling).toBe(a);
        expect(d.nextSibling).toBe(e);
        expect(e.previousSibling).toBe(d);
        children.splice(1, 3)
        expect(b.nextSibling).toBeUndefined();
        expect(b.previousSibling).toBeUndefined();
        expect(c.nextSibling).toBeUndefined();
        expect(c.previousSibling).toBeUndefined();
        expect(d.nextSibling).toBeUndefined();
        expect(d.previousSibling).toBeUndefined();
        expect(a.nextSibling).toBe(e);
        expect(e.previousSibling).toBe(a);
        expect(a.nextSibling).toBe(e);
        expect(e.previousSibling).toBe(a);
      })
    })
    describe("when objects are stack based observable objects", function() {
      it ("should make the inserted objects link to previous and next object", function() {
        var children = new LSD.ChildNodes;
        var a = new LSD.Journal;
        var b = new LSD.Journal;
        var c = new LSD.Journal;
        var d = new LSD.Journal;
        expect(children.length).toEqual(0);
        expect(a.nextSibling).toBeUndefined();
        expect(a.previousSibling).toBeUndefined();
        children.push(a); //a
        expect(a.nextSibling).toBeNull();
        expect(a.previousSibling).toBeNull();
        children.push(b); //ab
        expect(a.nextSibling).toEqual(b);
        expect(a.previousSibling).toBeNull();
        expect(b.nextSibling).toBeNull();
        expect(b.previousSibling).toEqual(a);
        children.push(c); //abc
        expect(a.nextSibling).toEqual(b);
        expect(a.previousSibling).toBeNull();
        expect(b.nextSibling).toEqual(c);
        expect(b.previousSibling).toEqual(a);
        expect(c.nextSibling).toBeNull();
        expect(c.previousSibling).toEqual(b);
        children.unshift(d); //dabc
        expect(a.nextSibling).toEqual(b);
        expect(a.previousSibling).toEqual(d);
        expect(b.nextSibling).toEqual(c);
        expect(b.previousSibling).toEqual(a);
        expect(c.nextSibling).toBeNull();
        expect(c.previousSibling).toEqual(b);
        expect(d.nextSibling).toEqual(a);
        expect(d.previousSibling).toBeNull();
        children.splice(children.indexOf(b), 1); //dac
        expect(a.nextSibling).toEqual(c);
        expect(a.previousSibling).toEqual(d);
        expect(b.nextSibling).toBeUndefined();
        expect(b.previousSibling).toBeUndefined();
        expect(c.nextSibling).toBeNull();
        expect(c.previousSibling).toEqual(a);
        expect(d.nextSibling).toEqual(a);
        expect(d.previousSibling).toBeNull();
        children.pop(); //da
        expect(a.nextSibling).toBeNull()
        expect(a.previousSibling).toEqual(d);
        expect(c.nextSibling).toBeUndefined();
        expect(c.previousSibling).toBeUndefined();
        expect(d.nextSibling).toEqual(a);
        expect(d.previousSibling).toBeNull();
        children.shift(); //a
        expect(a.nextSibling).toBeNull()
        expect(a.previousSibling).toBeNull();
        expect(d.nextSibling).toBeUndefined();
        expect(d.previousSibling).toBeUndefined();
        children.shift(); //<empty>
        expect(a.nextSibling).toBeUndefined()
        expect(a.previousSibling).toBeUndefined();
      });
      
      it ('should maintain nextElementSibling/previousElementSibling links', function() {
        var children = new LSD.ChildNodes;
        var a = new LSD.Journal({id: 'a', nodeType: 1});
        var b = new LSD.Journal({id: 'b', nodeType: 1});;
        var c = new LSD.Journal({id: 'c', nodeType: 1});;
        var d = new LSD.Journal({id: 'd', nodeType: 1});;
        var x = new LSD.Journal({id: 'x'});
        var y = new LSD.Journal({id: 'y'});
        var z = new LSD.Journal({id: 'z'});
        var index = 0, count = 0
        for (var nodes = [a,b,c,d], node, i = 0; node = nodes[i++];) {
          node.watch('nextElementSibling', function(value, old, memo) {
            if (value != null) index++;
            if (old != null) index --;
            count++;
          });
          node.watch('previousElementSibling', function(value, old, memo) {
            if (value != null) index++;
            if (old != null) index --;
            count++;
          });
        }
        children.push(a);
        expect(a.nextElementSibling).toBeUndefined();
        children.push(x);
        expect(a.nextElementSibling).toBeUndefined();
        expect(count).toEqual(0)
        expect(index).toEqual(0);
        children.push(b);
        expect(a.nextElementSibling).toBe(b);
        expect(b.previousElementSibling).toBe(a);
        expect(b.nextElementSibling).toBeUndefined();
        expect(index).toEqual(2);
        expect(count).toEqual(2)
        children.push(c);
        expect(c.previousElementSibling).toBe(b);
        expect(b.nextElementSibling).toBe(c)
        expect(c.nextElementSibling).toBeUndefined();
        expect(index).toEqual(4);
        expect(count).toEqual(4)
        children.push(y);
        expect(c.nextElementSibling).toBeUndefined();
        children.push(z);
        expect(c.nextElementSibling).toBeUndefined();
        children.push(d);
        expect(index).toEqual(6);
        expect(count).toEqual(6)
        expect(c.nextElementSibling).toBe(d);
        children.splice(0, 1);
        expect(index).toEqual(4);
        expect(count).toEqual(8)
        expect(a.nextElementSibling).toBeUndefined();
        expect(b.previousElementSibling).toBeUndefined();
        children.unshift(a);
        expect(a.nextElementSibling).toBe(b);
        expect(b.previousElementSibling).toBe(a);
        expect(index).toEqual(6);
        expect(count).toEqual(10)
        children.splice(0, 3);
        expect(index).toEqual(2);
        expect(count).toEqual(14)
        expect(a.nextElementSibling).toBeUndefined();
        expect(a.previousElementSibling).toBeUndefined();
        expect(b.nextElementSibling).toBeUndefined();
        expect(b.previousElementSibling).toBeUndefined();
        expect(c.previousElementSibling).toBeUndefined();
        expect(c.nextElementSibling).toBe(d);
        children.splice(2, 0, a, b)
        expect(c.nextElementSibling).toEqual(a);
        expect(a.previousElementSibling).toEqual(c);
        expect(a.nextElementSibling).toEqual(b);
        expect(b.previousElementSibling).toEqual(a);
        expect(b.nextElementSibling).toEqual(d);
        expect(d.previousElementSibling).toEqual(b);
        expect(d.nextElementSibling).toBeUndefined()
        expect(index).toEqual(6);
        expect(count).toEqual(20)
        children.shift();
        expect(index).toEqual(4);
        expect(count).toEqual(22)
        children.splice(0, 1, c)
        expect(index).toEqual(6);
        expect(count).toEqual(24)
      })
      
      it ("should maintain first/last links", function() {
        var children = new LSD.ChildNodes;
        var object = new LSD.Journal({children: children})
        var a = new LSD.Journal({id: 'a'});
        var b = new LSD.Journal({id: 'b'});;
        var c = new LSD.Journal({id: 'c'});;
        var d = new LSD.Journal({id: 'd'});;
        expect(object.firstChild).toBeUndefined();
        expect(object.lastChild).toBeUndefined();
        children.push(a); //a
        expect(object.firstChild).toEqual(a);
        expect(object.lastChild).toEqual(a);
        children.unshift(b); //ba
        expect(object.firstChild).toEqual(b);
        expect(object.lastChild).toEqual(a);
        children.splice(1, 0, c); //bac
        expect(object.firstChild).toEqual(b);
        expect(object.lastChild).toEqual(a);
        children.push(d); //bacd
        expect(object.firstChild).toEqual(b);
        expect(object.lastChild).toEqual(d);
        children.shift(); //cad
        expect(object.firstChild).toEqual(c);
        expect(object.lastChild).toEqual(d);
        children.shift(); //ad
        expect(object.firstChild).toEqual(a);
        expect(object.lastChild).toEqual(d);
        children.pop(); //a
        expect(object.firstChild).toEqual(a);
        expect(object.lastChild).toEqual(a);
        children.pop(); //
        expect(object.firstChild).toBeUndefined();
        expect(object.lastChild).toBeUndefined();
      });
      
      it ("should maintain parentNode link on each item of the array", function() {
        var children = new LSD.ChildNodes;
        var widget = new LSD.Object({
          childNodes: children
        });
        var a = new LSD.Journal({id: 'a'});
        var b = new LSD.Journal({id: 'b'});
        var c = new LSD.Journal({id: 'c'});
        expect(a.parentNode).toBeUndefined()
        children.push(a);
        expect(a.parentNode).toEqual(widget)
        children.push(b);
        expect(b.parentNode).toEqual(widget)
        children.unshift(c);
        expect(c.parentNode).toEqual(widget)
        children.pop();
        expect(b.parentNode).toBeUndefined();
        children.pop();
        expect(a.parentNode).toBeUndefined();
        children.pop();
        expect(c.parentNode).toBeUndefined();
        children.push(c);
        expect(c.parentNode).toEqual(widget)
        children.shift();
        expect(c.parentNode).toBeUndefined();
      })
    })
  });
  describe("when attached to an object", function() {
    it ("should export firstChild/lastChild properties", function() {
      var children = new LSD.ChildNodes;
      var widget = new LSD.Journal({
        childNodes: children
      });
      var a = new LSD.Journal({id: 'a'});
      var b = new LSD.Journal({id: 'b'});;
      var c = new LSD.Journal({id: 'c'});;
      var d = new LSD.Journal({id: 'd'});;
      expect(widget.firstChild).toBeUndefined();
      expect(widget.lastChild).toBeUndefined();
      children.push(a); //a
      expect(widget.firstChild).toEqual(a);
      expect(widget.lastChild).toEqual(a);
      children.unshift(b); //ba
      expect(widget.firstChild).toEqual(b);
      expect(widget.lastChild).toEqual(a);
      children.splice(1, 0, c); //bac
      expect(widget.firstChild).toEqual(b);
      expect(widget.lastChild).toEqual(a);
      children.push(d); //bacd
      expect(widget.firstChild).toEqual(b);
      expect(widget.lastChild).toEqual(d);
      children.shift(); //cad
      expect(widget.firstChild).toEqual(c);
      expect(widget.lastChild).toEqual(d);
      children.shift(); //ad
      expect(widget.firstChild).toEqual(a);
      expect(widget.lastChild).toEqual(d);
      children.pop(); //a
      expect(widget.firstChild).toEqual(a);
      expect(widget.lastChild).toEqual(a);
      children.pop(); //
      expect(widget.firstChild).toBeUndefined();
      expect(widget.lastChild).toBeUndefined();
      widget.unset('childNodes', children);
      expect(widget.firstChild).toBeUndefined();
      expect(widget.lastChild).toBeUndefined();
    })
  })
  
  describe("paired LSD.ChildNodes.Virtual", function() {
    describe("when given nodes", function() {
      it ("should transparently place the nodes from virtual collection to real children collection", function() {
        var parent = new LSD.Object({
          childNodes: new LSD.ChildNodes
        });
        var fragment = new LSD.Object({
          childNodes: new LSD.ChildNodes.Virtual
        });
        var subfragment = new LSD.Object({
          childNodes: new LSD.ChildNodes.Virtual
        });
        var a = new LSD.Object({id: 'a'});
        var b = new LSD.Object({id: 'b'});
        var c = new LSD.Object({id: 'c'});
        var d = new LSD.Object({id: 'd'});
        var e = new LSD.Object({id: 'e'});
        fragment.childNodes.push(a);
        parent.childNodes.push(fragment);
        expect(parent.childNodes.slice()).toEqual([fragment, a])
        parent.childNodes.push(e);
        expect(parent.childNodes.slice()).toEqual([fragment, a, e]);
        fragment.childNodes.push(b);
        expect(parent.childNodes.slice()).toEqual([fragment, a, b, e])
        parent.childNodes.splice(parent.childNodes.indexOf(fragment), 1);
        expect(parent.childNodes.slice()).toEqual([e])
        parent.childNodes.push(fragment);
        expect(parent.childNodes.slice()).toEqual([e, fragment, a, b])
        parent.childNodes.push(d);
        expect(parent.childNodes.slice()).toEqual([e, fragment, a, b, d])
        subfragment.childNodes.push(c);
        fragment.childNodes.push(subfragment)
        expect(parent.childNodes[0]).toBe(e);
        expect(parent.childNodes[1]).toBe(fragment);
        expect(parent.childNodes[2]).toBe(a);
        expect(parent.childNodes[3]).toBe(b);
        expect(parent.childNodes[4]).toBe(subfragment);
        expect(parent.childNodes[5]).toBe(c);
        expect(parent.childNodes[6]).toBe(d);
        subfragment.childNodes.pop();
        expect(parent.childNodes[0]).toBe(e);
        expect(parent.childNodes[1]).toBe(fragment);
        expect(parent.childNodes[2]).toBe(a);
        expect(parent.childNodes[3]).toBe(b);
        expect(parent.childNodes[4]).toBe(subfragment);
        expect(parent.childNodes[5]).toBe(d);
      })
    })
  })
});

