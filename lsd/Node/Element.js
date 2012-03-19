describe('LSD.Element', function() {
  describe('#initialize', function() {
    describe('when given no arguments', function() {
      it ('should create an instance of a widget', function() {
        var widget = new LSD.Element;
        expect(widget.appendChild).toEqual(LSD.Element.prototype.appendChild)
      })
    })
    describe("when given arguments", function() {
      it ("should instantiate without arguments", function() {
        var instance = new LSD.Element;
        expect(instance instanceof LSD.Element).toBeTruthy()
      });

      it ('should instantiate with element as argument', function() {
        var element = new Element('div');
        var instance = new LSD.Element(element);
        expect(instance.origin == element).toBeTruthy();
      });

      it ('should instantiate with options as argument', function() {
        var options = {magic: 784};
        var instance = new LSD.Element(options);
        expect(instance.magic == 784).toBeTruthy();
      });

      it ('should instantiate with options and element as arguments', function() {
        var options = {'honk': 'kong'};
        var element = new Element('div');
        var instance = new LSD.Element(options, element);
        expect(instance.honk == 'kong').toBeTruthy();
        expect(instance.origin == element).toBeTruthy();
      });

      it ('should instantiate with element and options as arguments', function() {
        var options = {'honk': 'kong'};
        var element = new Element('div');
        var instance = new LSD.Element(element, options);
        expect(instance.honk == 'kong').toBeTruthy();
        expect(instance.origin == element).toBeTruthy();
      });
      
      it ('should create a clone of an widget', function() {
        var origin = new LSD.Element({
          attributes: {
            title: "Jeez"
          }
        });
        var instance = new LSD.Element(origin);
        expect(instance.attributes.title).toEqual('Jeez')
      })
    });
  })
  
  describe('#properties', function() {
    describe('.attributes', function() {
      it ('when an attributes are given', function() {
        var widget = new LSD.Element({
          attributes: {
            title: 'Click here'
          }
        });
        expect(widget.attributes.title).toEqual('Click here');
        widget.set('attributes.title', 'Click there');
        expect(widget.attributes instanceof LSD.Properties.Attributes).toBeTruthy()
        expect(widget.attributes.title).toEqual('Click there');
        widget.unset('attributes.title', 'Click there');
        widget.set('attributes.title', 'Click here');
      })
    });
    describe('.origin', function() {
      describe('when widget doesnt have its own attributes', function() {
        it ('should extract attributes', function() {
          var widget = new LSD.Element;
          var element = document.createElement('button');
          element.setAttribute('onclick', 'roll');
          widget.set('origin', element);
          expect(widget.attributes.onclick).toEqual('roll');
        })
      });
      describe('when widget has its own attributes', function() {
        describe('and widget attributes dont overlap with element attributes', function() {
          it ('should merge attributes together', function() {
            var widget = new LSD.Element({attributes: {id: 'josh'}});
            var element = document.createElement('button');
            element.setAttribute('name', 'jack');
            widget.set('origin', element);
            expect(widget.attributes.name).toEqual('jack');
            expect(widget.attributes.id).toEqual('josh');
          })
        })
        describe('and widget attributes overlap with element attributes', function() {
          it ('should give priority to widget attributes and restore to element attributes when overlapping widget attribute is removed', function() {
            var widget = new LSD.Element({attributes: {name: 'josh'}});
            var element = document.createElement('button');
            element.setAttribute('name', 'jack');
            widget.set('origin', element);
            expect(widget.attributes.name).toEqual('josh');
            widget.attributes.unset('name', 'josh');
            expect(widget.attributes.name).toEqual('jack');
            widget.unset('origin', element);
            expect(widget.attributes.name).toBeUndefined()
            
          })
        })
      });
      describe('when attributes contain interpolated values', function() {
        describe('when value is interpolated', function() {
          it ('should watch for values and update attribute', function() {
            var widget = new LSD.Element;
            var element = document.createElement('button');
            element.setAttribute('tabindex', '${x + 1}')
            widget.set('origin', element);
            expect(widget.attributes.tabindex).toBeUndefined();
            widget.variables.set('x', 5);
            expect(widget.attributes.tabindex).toBe(6);
            widget.variables.set('x', -1)
            expect(widget.attributes.tabindex).toBe(0);
            widget.unset('origin', element)
            expect(widget.attributes.tabindex).toBeUndefined();
          })
        })
        describe('when two interpolations are within a single attribute', function() {
          it ('should watch for values and update attribute', function() {
            var widget = new LSD.Element;
            var element = document.createElement('button');
            element.setAttribute('tabindex', '${x + 1} & ${x - 1}')
            widget.set('origin', element);
            expect(widget.attributes.tabindex).toBeUndefined();
            widget.variables.set('x', 5);
            expect(widget.attributes.tabindex).toBe('6 & 4');
            widget.variables.set('x', -1)
            expect(widget.attributes.tabindex).toBe('0 & -2');
            widget.unset('origin', element)
            expect(widget.attributes.tabindex).toBeUndefined();
          })
        })
        describe('when interpolation is within a single attribute', function() {
          it ('should watch for values and update attribute', function() {
            var widget = new LSD.Element;
            var element = document.createElement('button');
            element.setAttribute('title', 'xxx${x + 1}xx')
            widget.set('origin', element);
            expect(widget.attributes.title).toBeUndefined();
            widget.variables.set('x', 5);
            expect(widget.attributes.title).toBe('xxx6xx');
            widget.variables.set('x', -1)
            expect(widget.attributes.title).toBe('xxx0xx');
            widget.unset('origin', element)
            expect(widget.attributes.title).toBeUndefined();
          })
        });
        describe('when interpolation is not within a value of attribute', function() {
          describe('and interpolation is simple', function() {
            it ('should watch for values and update attribute', function() {
              var widget = new LSD.Element;
              var wrapper = document.createElement('div');
              wrapper.innerHTML = '<button ${object} />';
              var element = wrapper.firstChild;
              widget.set('origin', element);
              expect(widget.attributes.title).toBeUndefined();
              widget.variables.set('object', {title: 'Jeeez nigga'})
              expect(widget.attributes.title).toBe('Jeeez nigga');
              widget.variables.set('object', {title: 'Jeeezos chr0ss'})
              expect(widget.attributes.title).toBe('Jeeezos chr0ss');
              widget.unset('origin', element);
              expect(widget.attributes.title).toBeUndefined();
            })
          });
          describe('and interpolation is complex - contains spaces', function() {
            it ('should watch for values and update attribute', function() {
              var widget = new LSD.Element;
              var wrapper = document.createElement('div');
              wrapper.innerHTML = '<button ${condition && object} />';
              var element = wrapper.firstChild;
              widget.set('origin', element);
              expect(widget.attributes.title).toBeUndefined();
              widget.variables.set('object', {title: 'Jeeez nigga'})
              expect(widget.attributes.title).toBeUndefined();
              widget.variables.set('condition', true)
              expect(widget.attributes.title).toBe('Jeeez nigga');
              widget.variables.set('condition', false)
              expect(widget.attributes.title).toBeUndefined();
              widget.variables.set('object', {title: 'Jeeezos chr0ss'})
              expect(widget.attributes.title).toBeUndefined();
              widget.variables.set('condition', true)
              expect(widget.attributes.title).toBe('Jeeezos chr0ss');
              widget.variables.set('object', {title: 'Jeeezos chr0sZ'})
              expect(widget.attributes.title).toBe('Jeeezos chr0ssZ');
              widget.unset('origin', element);
              expect(widget.attributes.title).toBeUndefined();
            })
          })
        })
      })
    });
    describe('.sourceIndex', function() {
      describe('when used out of document', function() {
        it('should assign a property to element structures', function() {
          var f = new LSD.Element({name: 'f'})
          var a = new LSD.Element({name: 'a'})
          var b = new LSD.Element({name: 'b'})
          var c = new LSD.Element({name: 'c'})
          var bb = new LSD.Element({name: 'bb'})
          var bb2 = new LSD.Element({name: 'bb2'})
          var cc = new LSD.Element({name: 'cc'})
          var d = new LSD.Element({name: 'd'})
          a.childNodes.push(c); // c
          //expect(a.sourceIndex).toEqual(0);
          expect(c.sourceIndex).toEqual(1);
          a.childNodes.unshift(b); // b, c
          expect(b.previousSibling).toBe(null)
          expect(b._stack.nextSibling[0]).toEqual(c)
          expect(b.nextSibling).toEqual(c)
          expect(b.sourceIndex).toEqual(1);
          expect(c.sourceIndex).toEqual(2);
          b.childNodes.push(bb) // b[bb], c
          expect(b.sourceIndex).toEqual(1);
          expect(b.sourceLastIndex).toEqual(2);
          expect(bb.sourceIndex).toEqual(2);
          expect(c.sourceIndex).toEqual(3);
          c.childNodes.push(cc) // b[bb], c[cc]
          expect(c.sourceLastIndex).toEqual(4);
          a.childNodes.unshift(f); // f, b[bb], c[cc]
          expect(b._stack.previousSibling[0]).toEqual(f)
          expect(b._stack.nextSibling[0]).toEqual(c)
          expect(f.sourceIndex).toEqual(1);
          expect(b.sourceIndex).toEqual(2);
          expect(b.sourceLastIndex).toEqual(3);
          expect(bb.sourceIndex).toEqual(3);
          expect(c.sourceIndex).toEqual(4);
          expect(c.sourceLastIndex).toEqual(5);
          expect(cc.sourceIndex).toEqual(5);
          a.childNodes.push(d) // f, b[bb], c[cc], d
          expect(d.sourceIndex).toEqual(6);
          a.childNodes.shift() // b[bb], c[cc], d
          expect(b.sourceIndex).toEqual(1);
          expect(b.sourceLastIndex).toEqual(2);
          expect(bb.sourceIndex).toEqual(2);
          expect(c.sourceIndex).toEqual(3);
          expect(c.sourceLastIndex).toEqual(4);
          expect(cc.sourceIndex).toEqual(4);
          expect(d.sourceIndex).toEqual(5);
          a.childNodes.splice(1, 1); // b[bb], d
          expect(b.sourceIndex).toEqual(1);
          expect(bb.sourceIndex).toEqual(2);
          expect(d.sourceIndex).toEqual(3);
          expect(b.previousElementSibling).toBeUndefined()
          expect(b.nextElementSibling).toBe(d)
          expect(b._stack.nextElementSibling.length).toBe(1)
          a.childNodes.shift() // d
          expect(b.parentNode).toBeUndefined()
          expect(b.previousSibling).toBeNull()
          expect(b.nextSibling).toBeNull()
          expect(b.previousElementSibling).toBeUndefined()
          expect(b.nextElementSibling).toBeUndefined()
          expect(d.sourceIndex).toEqual(1);
          a.childNodes.push(b) // d, b[bb]
          expect(b.sourceIndex).toEqual(2);
          expect(bb.sourceIndex).toEqual(3);
        })
        
        it ("should be kept when doing regular manipulations", function() {
            var root = new LSD.Element({tag: 'root'})

            var pane1 = new LSD.Element({tag: 'pane'});
            var pane2 = new LSD.Element({tag: 'pane'});
            var pane3 = new LSD.Element({tag: 'pane'});

            pane2.appendChild(pane3);
            expect(pane2.sourceIndex).toBeUndefined()
            expect(pane3.sourceIndex).toEqual(1);
            expect(pane2.sourceLastIndex).toEqual(1);
            expect(pane3.sourceLastIndex).toBeFalsy();

            root.appendChild(pane2)
            expect(root.sourceLastIndex).toEqual(2);
            expect(root.sourceIndex).toBeUndefined()
            expect(pane2.sourceIndex).toEqual(1);
            expect(pane2.sourceLastIndex).toEqual(2);
            expect(pane3.sourceIndex).toEqual(2);
            expect(pane3.sourceLastIndex).toBeFalsy();
            
            expect(pane2.sourceLastIndex).toEqual(2);
            root.appendChild(pane1);
            expect(root.sourceLastIndex).toEqual(3);
            expect(pane1.sourceIndex).toEqual(3);
            
            var rooty = new LSD.Element({tag: 'root'})
            rooty.appendChild(root);
            expect(rooty.sourceLastIndex).toEqual(4);
            expect(rooty.sourceIndex).toBeUndefined()
            expect(root.sourceLastIndex).toEqual(4);
            expect(root.sourceIndex).toEqual(1);
            expect(pane2.sourceIndex).toEqual(2);
            expect(pane2.sourceLastIndex).toEqual(3);
            expect(pane3.sourceIndex).toEqual(3);
            expect(pane3.sourceLastIndex).toBeFalsy();
            
            var pane4 = new LSD.Element({tag: 'kane'});
            pane2.appendChild(pane4);
            expect(rooty.sourceLastIndex).toEqual(5);
            expect(rooty.sourceIndex).toBeUndefined()
            expect(root.sourceLastIndex).toEqual(5);
            expect(root.sourceIndex).toEqual(1);
            expect(pane1.sourceIndex).toEqual(5);
            expect(pane2.sourceIndex).toEqual(2);
            expect(pane2.sourceLastIndex).toEqual(4);
            expect(pane3.sourceLastIndex).toBeFalsy();
            expect(pane3.sourceIndex).toEqual(3);
            expect(pane4.sourceIndex).toEqual(4);
        })
      })
    });
    describe('.inline', function() {
      describe('when localName is given', function() {
        describe('when inline is set to true', function() {
          it('should build widget with tag from the localName', function() {
            var widget = new LSD.Element({
              localName: 'h2',
              inline: true
            });
            expect(widget.localName).toEqual('h2');
          })
        })
        describe('when inline is set to false', function() {
          it('should build widget with tag from the localName', function() {
            var widget = new LSD.Element({
              localName: 'h2',
              inline: false
            });
            expect(widget.localName).toEqual('h2');
          })
        })
      });
      describe('when no localName is given', function() {
        describe('when inline is set to true', function() {
          it('should build widget with tag from the localName', function() {
            var widget = new LSD.Element({
              inline: true
            });
            expect(widget.localName).toEqual('span');
          })
        })
        describe('when inline is set to false', function() {
          it('should build widget with tag from the localName', function() {
            var widget = new LSD.Element({
              inline: false
            });
            expect(widget.localName).toEqual('div');
          })
        })
      })
    })
    describe('.focused', function() {
      it('should focus parents and refocus parents when they change', function() {
        var root = new LSD.Element('root');
        var list = new LSD.Element('list')
        var item = new LSD.Element('item')
        root.appendChild(list);
        list.appendChild(item);
        item.set('focused', true);
        expect(list.focused).toEqual(true);
        expect(root.focused).toEqual(true);
        var root2 = new LSD.Element('root')
        var list2 = new LSD.Element('list')
        root2.appendChild(list2);
        list2.appendChild(item);
        expect(list.focused).toBe(false)
        expect(root.focused).toBe(false)
        expect(list2.focused).toEqual(true);
        expect(root2.focused).toEqual(true);
      })
      
      describe('when elements have document', function() {
        it('should allow only one focused element at time', function() {
          var document = new LSD.Document;
          var root = document.createElement('root');
          var list = document.createElement('list');
          var item = document.createElement('item');
          root.appendChild(list);
          list.appendChild(item);
          item.set('focused', true);
          expect(list.focused).toEqual(true);
          expect(root.focused).toEqual(true);
          var item2 = document.createElement('item');
          list.appendChild(item2);
          item2.set('focused', true);
          expect(item.focused).toBe(false)
          expect(item2.focused).toBeTruthy();
          item.set('focused', true)
          expect(item2.focused).toBe(false)
          expect(item.focused).toBeTruthy();
        });
        it('should only blur parents that are not shared between the previous and the new active element', function() {
          var document = new LSD.Document;
          var root = document.createElement('root');
          var list = document.createElement('list');
          var item = document.createElement('item');
          var list2 = document.createElement('list');
          var item2 = document.createElement('item');
          root.appendChild(list);
          list.appendChild(item);
          root.appendChild(list2);
          list2.appendChild(item2);
          var r = 0, l = 0, i = 0;
          root.watch('focused', function() {
            r++;
          })
          list.watch('focused', function() {
            l++;
          })
          item2.watch('focused', function() {
            i++;
          })
          item.set('focused', true);
          expect(r).toBe(2);
          expect(l).toBe(2);
          expect(i).toBe(1);
          item2.set('focused', true);
          expect(r).toBe(2);
          expect(l).toBe(3);
          expect(i).toBe(2);
          document.reset('activeElement', list2)
          expect(r).toBe(2);
          expect(l).toBe(3);
          expect(i).toBe(3);
          document.reset('activeElement', list)
          expect(r).toBe(2);
          expect(l).toBe(4);
          expect(i).toBe(3);
          document.reset('activeElement', root)
          expect(r).toBe(2);
          expect(l).toBe(5);
          expect(i).toBe(3);
          document.reset('activeElement', item2)
          expect(r).toBe(2);
          expect(l).toBe(5);
          expect(i).toBe(4);
          document.unset('activeElement', item2)
          expect(r).toBe(3);
          expect(l).toBe(5);
          expect(i).toBe(5);
          expect(root.focused).toBe(false);
          expect(list.focused).toBe(false);
          expect(item2.focused).toBe(false);
        })
      })
    })
  });
  
  describe('#build', function() {
    describe('when no tags was given', function() {
      it ('should create a div', function() {
        var widget = new LSD.Element;
        widget.build();
        expect(widget.element).toBeTruthy();
        expect(widget.tagName).toBeNull();
        expect(widget.localName).toEqual('div')
        expect(widget.element.tagName).toEqual('DIV')
      })
    });
    describe('when localName was given', function() {
      it ('should use that tagName to build a new element', function() {
        var widget = new LSD.Element({
          tagName: 'h2'
        });
        widget.build();
        expect(widget.tagName).toEqual('h2');
        expect(widget.localName).toEqual('h2');
        expect(widget.element.tagName).toEqual('H2')
      })
    });
    describe('when localName and tagName was given', function() {
      it ('should use localName for element and tagName for the widget', function() {
        var widget = new LSD.Element({
          tagName: 'h2',
          localName: 'h3'
        });
        widget.build();
        expect(widget.tagName).toEqual('h2');
        expect(widget.localName).toEqual('h3');
        expect(widget.element.tagName).toEqual('H3')
      })
    });
    describe('when attributes are given', function() {
      it ('should build element with those attributes', function() {
        var widget = new LSD.Element({
          attributes: {
            hidden: true,
            title: 'Click me'
          }
        });
        widget.build();
        expect(widget.element.getAttribute('hidden')).toNotEqual(null);
        expect(widget.element.getAttribute('title')).toEqual('Click me');
      });
    });
  });
  
  describe('#test', function() {
    describe('when specific tag is used in selector', function() {
      describe('and tag is not defined', function() {
        it ('should not match that selector', function() {
          var widget = new LSD.Element;
          expect(widget.test('div')).toBeFalsy();
        })
      });
      describe('and tag is defined', function() {
        describe('and tags match', function() {
          it ('should be truthy', function() {
            var widget = new LSD.Element({tagName: 'div'});
            expect(widget.test('div')).toBeTruthy();
          })
        })
        describe('and tags dont match', function() {
          it ('should be falsy', function() {
            var widget = new LSD.Element({tagName: 'h2'});
            expect(widget.test('div')).toBeFalsy();
          })
        })
      });
    });
    describe('when attributes are used in selector', function() {
      describe('when attribute is defined', function() {
        it ('should not match the selector', function() {
          var widget = new LSD.Element;
          expect(widget.test('[hidden]')).toBeFalsy();
        })
      });
      describe('when attribute is defined', function() {
        describe('and attribute value is not given', function() {
          it ('should match the selector', function() {
            var widget = new LSD.Element({attributes: {hidden: true}});
            expect(widget.test('[hidden]')).toBeTruthy();
          })
        })
        describe('and attributes match', function() {
          it ('should match the selector', function() {
            var widget = new LSD.Element({attributes: {title: 'lol'}});
            expect(widget.test('[title=lol]')).toBeTruthy();
          })
        });
        describe('and attributes dont match', function() {
          it ('should not match the selector', function() {
            var widget = new LSD.Element({attributes: {title: 'lol'}});
            expect(widget.test('[title=lul]')).toBeFalsy();
          })
        });
      });
    })
  })
})