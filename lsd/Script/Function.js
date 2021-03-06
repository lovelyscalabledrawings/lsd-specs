describe("LSD.Script.Function", function() {
  describe("when a function is called", function() {
    
    describe("and the first given argument is array", function() {
      describe("and the method is set in array prototype", function() {
        it("should execute that array method", function() {
          var scope = new LSD.Journal;
          var script = LSD.Script('slice(object, 1)', scope);
          scope.set('object', [1, 2, 3]);
          expect(script.value).toEqual([2, 3]);
        });
      });
      describe("and method is not set in array prototype", function() {
        describe("and there is a fallback method defined", function() {
          it("should use fallback method", function() {
            var scope = new LSD.Journal;
            scope.set('slicez', function(object, index, offset) {
              return object.slice(index, offset)
            })
            var script = LSD.Script('slicez(object, 1, 3)', scope);
            scope.set('object', [1, 2, 3]);
            expect(script.value).toEqual([2, 3]);
          });
        });
        describe("and the method is not defined as fallback", function() {
          it ("should not execute any method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('void(object)', scope);
            scope.set('object', [1, 2, 3]);
            expect(script.value).toEqual(null);
          })
        })
      });
    });
    
    describe("and the first given argument is number", function() {
      describe("and the method is set in number prototype", function() {
        it("should execute that number method", function() {
          var scope = new LSD.Journal;
          var script = LSD.Script('ordinalize(object)', scope);
          scope.set('object', 2);
          expect(script.value).toEqual('2nd');
        });
      });
      describe("and method is not set in number prototype", function() {
        describe("and there is a fallback method defined", function() {
          it("should use fallback method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('count(object)', scope);
            scope.set('count', function(object) {
              return object.length != null ? object.length : object;
            })
            scope.set('object', 2);
            expect(script.value).toEqual(2);
          });
        });
        describe("and the method is not defined as fallback", function() {
          it ("should not execute any method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('void(object)', scope);
            scope.set('object', 2);
            expect(script.value).toEqual(null);
          })
        })
      });
    });
    
    
    describe("and the first given argument is object", function() {
      describe("and the method is set in object base class", function() {
        it("should execute that object method", function() {
          var scope = new LSD.Journal;
          var script = LSD.Script('keys(object)', scope);
          scope.set('object', {a: 1, b: 2, y: 3});
          expect(script.value).toEqual(['a', 'b', 'y']);
        });
      });
      describe("and method is not set in object prototype", function() {
        describe("and there is a fallback method defined", function() {
          it("should use fallback method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('keyz(object)', scope);
            scope.set('keyz', function(object) {
          		var keys = [];
          		for (var key in object){
          			if (hasOwnProperty.call(object, key)) keys.push(key);
          		}
          		return keys;
            })
            scope.set('object', {a: 1, b: 2, y: 3});
            expect(script.value).toEqual(['a', 'b', 'y']);
          });
        });
        describe("and the method is not defined as fallback", function() {
          it ("should not execute any method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('void(object)', scope);
            scope.set('object', {a: 1});
            expect(script.value).toEqual(null);
          })
        })
      });
    });
    
    describe("and the first given argument is element", function() {
      describe("and the method is set in element prototype", function() {
        it("should execute that element method", function() {
          var scope = new LSD.Journal;
          var script = LSD.Script('getAttribute(object, "title")', scope);
          var div = document.createElement('div');
          div.title = 'Loleo'
          scope.set('object', div);
          expect(script.value).toEqual('Loleo');
        });
      });
      describe("and method is not set in element prototype", function() {
        describe("and there is a fallback method defined", function() {
          it("should use fallback method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('getSomething(object, "title")', scope);
            scope.set('getSomething', function(object, name) {
              return object.getAttribute(name)
            })
              var div = document.createElement('div');
              div.title = 'Loleo'
              scope.set('object', div);
            expect(script.value).toEqual('Loleo');
          });
        });
        describe("and the method is not defined as fallback", function() {
          it ("should not execute any method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('void(object)', scope);
            var div = document.createElement('div');
            div.title = 'Loleo'
            scope.set('object', div);
            expect(script.value).toEqual(null);
          })
        })
      });
    });
    
    
    describe("and the first given argument is widget", function() {
      describe("and the method is set in widget prototype", function() {
        it("should execute that widget method", function() {
          var scope = new LSD.Journal;
          var script = LSD.Script('getAttribute(object, "title")', scope);
          scope.set('object', new LSD.Element({attributes: {title: 'Loleo'}}));
          expect(script.value).toEqual('Loleo');
        });
      });
      describe("and method is not set in widget prototype", function() {
        describe("and there is a fallback method defined", function() {
          it("should use fallback method", function() {
            var scope = new LSD.Journal;
            var script = LSD.Script('getSomething(object, "title")', scope);
            scope.set('getSomething', function(object, name) {
              return object.getAttribute(name)
            })
            scope.set('object', new LSD.Element({attributes: {title: 'Loleo'}}));
            expect(script.value).toEqual('Loleo');
          });
        });
        describe("and the method is not defined as fallback", function() {
          it ("should not execute any method", function() {
            
          })
        })
      });
    });
  });
  
  describe("when operator is used on two values", function() {
    describe("and that operator is =", function() {
      it ("should not evaluate first argument and use it as name to define the variable with the second value", function() {
        var scope = new LSD.Journal;
        var script = LSD.Script('incremented = number + 1', scope);
        scope.set('number', 1);
        expect(script.value).toEqual(2)
        expect(scope.incremented).toEqual(2);
      })
    })
  });
  
  describe("when expression consists of multiple function calls", function() {
    var scope = new LSD.Journal;
    scope.set('submit', function() {
      return 1337
    });
    scope.set('make', function(value) {
      return new LSD.Element({attributes: {title: value}})
    });
    scope.set('return', function(value) {
      return Array.prototype.slice.call(arguments)
    });
    describe("when the pipee function doesnt have any arguments", function() {
      it("should pipe arguments from one function call to another", function() {
        var script = LSD.Script('submit(), return()', scope);
        expect(script.value).toEqual([1337])
      });
      describe("and value changes", function() {
        it ("should reevaluate the expression and re-pipe value again", function() {
          var local = new LSD.Journal(scope);
          local.set('n', 1336)
          var script = LSD.Script('return(n), return()', local);
          expect(script.value).toEqual([[1336]])
          local.set('n', 1338)
          expect(script.value).toEqual([[1338]])
        })
      })
    })
    describe("when a pipee function has arguments by itself", function() {
      describe("and that argument is a simple value", function() {
        it ("should push piped argument at the end", function() {
          var script = LSD.Script('submit(), return("fire")', scope);
          expect(script.value).toEqual(["fire", 1337])
        });
        describe("and pipe consists of more than two function calls", function() {
          it ("should push piped argument at the end", function() {
            var script = LSD.Script('submit(), return("fire"), return("ice")', scope);
            expect(script.value).toEqual(["ice", ["fire", 1337]])
          });
        })
        describe("and piped argument is a widget", function() {
          describe("and a pipee function can be resolved on the argument", function() {
            it ("should use the widget as argument and execute function on argument", function() {
              var script = LSD.Script('make(), return("fire")', scope);
              expect(script.value[0]).toEqual('fire');
              expect(script.value[1].nodeType).toEqual(1);
            });
          })
          describe("and a pipee function only resolves on widget", function() {
            it ("should use the widget as argument and execute function on argument", function() {
              var script = LSD.Script('make(), setAttribute("tabindex", -1)', scope);
              expect(script.value.attributes.tabindex).toEqual(-1)
            });
            describe("and there are more expressions", function() {
              it ("should pipe it through", function() {
                var script = LSD.Script('make(), setAttribute("tabindex", -1), return()', scope);
                expect(script.value[0].nodeType).toEqual(1)
              })            
            })
          })
        })
      })
    });
    describe("and functions dont have explicit arguments", function() {
      it ("should be able to pipe both arguments and context", function() {
        var scope = new LSD.Element({tagName: 'container'});
        scope.request = function() {
          return true
        };
        scope.create = function(success) {
          if (success === true) return new LSD.Element({tagName: 'response'}) 
        };
        var script = LSD.Script('request(), create(), grab()', scope)
        expect(scope.childNodes[0].tagName).toEqual('response')
      })
    })
    describe("when function is executed in context `dot.notation()`", function() {
      describe("and context for that function call is a result of execution of other function", function() {
        it("should use returned values", function() {
          var script = LSD.Script('make(123).return()', scope);
          expect(script.value[0].attributes.title).toEqual(123)
        })
      })
      describe("and context for that function call is a variable pointing to widget", function() {
        it("should use returned values", function() {
          var local = new LSD.Journal(scope);
          local.set('widget', new LSD.Element)
          var script = LSD.Script('widget.return()', local);
          expect(script.value[0].nodeType).toEqual(1)
        })
      })
      describe("and context for that function call is a variable pointing to simple value", function() {
        it("should use returned values", function() {
          var local = new LSD.Journal(scope);
          local.set('dog', 'hot')
          var script = LSD.Script('dog.return()', local);
          expect(script.value).toEqual(['hot'])
        })
      })
    })
    describe("when functions are nested", function() {
      it("should use returned values", function() {
        var script = LSD.Script('return(make(123))', scope);
        expect(script.value[0].attributes.title).toEqual(123)
      })
    });
    describe("and function is called in context of", function() {
      describe("a block", function() {
        describe("that iterates over widget collection", function() {
          it ("should use widget as a context", function() {
            var local = new LSD.Journal(scope);
            local.set('items', [
              new LSD.Element({attributes: {title: 'L'}}),
              new LSD.Element({attributes: {title: 'S'}}),
              new LSD.Element({attributes: {title: 'D'}})
            ])
            var script = LSD.Script('items.map { getAttribute("title") }', local)
            expect(script.value).toEqual(['L', 'S', 'D'])
          })
        });
        describe("that iterates over element collection", function() {
          it ("should use element as a context", function() {
            var local = new LSD.Journal(scope);
            var l = document.createElement('div');
            l.title = 'L'
            var s = document.createElement('div');
            s.title = 'S'
            var d = document.createElement('div');
            d.title = 'D'
            var cruft = document.createElement('cruft');
            local.set('items', [l,s,d])
            var script = LSD.Script('items.map { getAttribute("title") }', local)
            expect(script.value).toEqual(['L', 'S', 'D'])
          })
        });
        describe("that iterates over element collection", function() {
          it ("should not change context", function() {
            var local = new LSD.Journal;
            local.set('items', ['L', 'S', 'D'])
            var script = LSD.Script('items.map { |a| a.toLowerCase() }', local)
            expect(script.value).toEqual(['l', 's', 'd'])
            local.set('items', ['D', 'S', 'L'])
            expect(script.value).toEqual(['d', 's', 'l'])
            
          })
        });
      })
    });
    describe("when function uses .dot() notation", function() {
      describe("through a widget property", function() {
        it ("should be able to access value and call a function upon it", function() {
          var local = new LSD.Journal(scope);
          var items = [
            new LSD.Element({attributes: {title: 'L'}}),
            new LSD.Element({attributes: {title: 'S'}}),
            new LSD.Element({attributes: {title: 'D'}})
          ];
          local.set('items', items)
          local.set('name', 'borscht')
          var script = LSD.Script('items.forEach { |item| item.attributes.set("food", name)}', local)
          expect(items.every(function(item) { 
            return item.attributes.food == 'borscht'
          })).toBeTruthy()
          //local.set('name', 'mashed potato');
          //expect(items.every(function(item) { 
          //  return item.attributes.food == 'mashed potato'
          //})).toBeTruthy()
        })
      })
    })
  });
  
});