describe('LSD.Array', function() {
  describe('when initialized', function() {
    describe('without arguments', function() {
      it ('should create new observable array', function() {
        var array = new LSD.Array();
        expect(array.length).toEqual(0);
      })
    });
    describe('with a single argument', function() {
      describe('with a primitive', function() {
        [true, false, 0, null, 123, 'lol', {a: 1}, window.Z0NdEf1n3d].each(function(value) {
          it('should create new one-element obserable array', function() {
            var array = new LSD.Array(value);
            expect(array.length).toEqual(1);
            expect(array[0]).toEqual(value);
          })
        })
      })
      describe ('with array', function() {
        it ('should create new observable array with array properties', function() {
          var origin = [1,2];
          var array = new LSD.Array(origin);
          expect(array).toNotEqual(origin);
          expect(array.length).toEqual(origin.length);
          expect(array[0]).toEqual(origin[0]);
          expect(array[1]).toEqual(origin[1]);
          expect(array[2]).toEqual(origin[2]);
        })
      });
      describe('with arguments', function() {
        it ('should create new observable array with each argument as a property', function() {
          !function() {
            var array = new LSD.Array(arguments);
            expect(array).toNotEqual(arguments);
            expect(array.length).toEqual(arguments.length);
            expect(array[0]).toEqual(arguments[0]);
            expect(array[1]).toEqual(arguments[1]);
            expect(array[2]).toEqual(arguments[2]);
          }('lol', {a: 1});
        })
      })
      describe('with node list', function() {
        it ('should create new observable array with each node as a property', function() {
          var element = document.createElement('div');
          element.appendChild(document.createElement('h1'));
          element.appendChild(document.createElement('p'));
          var nodes = element.childNodes;
          var array = new LSD.Array(nodes);
          expect(array).toNotEqual(nodes);
          expect(array.length).toEqual(nodes.length);
          expect(array[0]).toEqual(nodes[0]);
          expect(array[1]).toEqual(nodes[1]);
          expect(array[2]).toEqual(nodes[2]);
        })
      });
    })
    describe('with multiple arguments', function() {
      describe('and none of them are enumerable', function() {
        it ('should create new observable array from arguments', function() {
          var array = new LSD.Array(0, 1);
          expect(array.length).toEqual(2);
          expect(array[0]).toEqual(0);
          expect(array[1]).toEqual(1);
          expect(array[2]).toBeUndefined();
        })
      })
      describe('and some of arguments are enumerables', function() {
        it ('should create new observable array from arguments but enumerables will not be flatten', function() {
          var a = [1,2]
          var array = new LSD.Array(a, 1);
          expect(array.length).toEqual(2);
          expect(array[0]).toEqual([1,2]);
          expect(array[1]).toEqual(1);
          expect(array[2]).toBeUndefined();
        })
      })
    });
  });
  
  describe('#push', function() {
    describe('when given a single argument', function() {
      it ('should notify observers on each push and provide the position of insertion as the second argument', function() {
        var array = new LSD.Array;
        var pushed = [];
        array.addEvent('change', function(value, index, state) {
          expect(index).toEqual(array.length - 1);
          pushed.push([value, index]);
        });
        expect(pushed).toEqual([]);
        array.push(1);
        expect(pushed).toEqual([[1, 0]]);
        array.push(2);
        expect(pushed).toEqual([[1, 0], [2, 1]]);
        expect(array[0]).toEqual(1);
        expect(array[1]).toEqual(2);
      });
    });
    
    describe('when given multiple arguments', function() {
      it ('should notify observers with each argument separately', function() {
        var array = new LSD.Array;
        var pushed = [], count = 0;
        array.addEvent('change', function(value, index, state) {
          expect(index).toEqual(array.length - 1);
          pushed.push([value, index]);
          count++;
        });
        expect(pushed).toEqual([]);
        array.push(1, 2);
        expect(pushed).toEqual([[1, 0], [2, 1]]);
        expect(count).toEqual(2);
        array.push([555], 4);
        expect(pushed).toEqual([[1, 0], [2, 1], [[555], 2], [4, 3]]);
        expect(count).toEqual(4);
        expect(array[0]).toEqual(1);
        expect(array[1]).toEqual(2);
        expect(array[2]).toEqual([555]);
        expect(array[3]).toEqual(4);
      })
    });
  });
  
  describe('#slice', function() {
    describe('when given no arguments', function() {
      it ("should create a copy of array", function() {
        var array = new LSD.Array([1, 2, 3]);
        var copy = array.slice();
        expect(copy).toNotEqual(array);
        expect(copy[0]).toEqual(array[0]);
        expect(copy[1]).toEqual(array[1]);
        expect(copy[2]).toEqual(array[2]);
        expect(copy[3]).toEqual(array[3]);
      });
    });
    describe('when given a single argument - starting index', function() {
      describe('equal to zero', function() {
        it ("should create a copy of array", function() {
          var array = new LSD.Array([1, 2, 3]);
          var copy = array.slice();
          expect(copy).toNotEqual(array);
          expect(copy.length).toEqual(3)
          expect(copy[0]).toEqual(array[0]);
          expect(copy[1]).toEqual(array[1]);
          expect(copy[2]).toEqual(array[2]);
          expect(copy[3]).toEqual(array[3]);
        });
      });
      describe('not equal to zero', function() {
        it ("should create a copy of array starting from the given offset", function() {
          var array = new LSD.Array([1, 2, 3]);
          var copy = array.slice(1);
          expect(copy).toNotEqual(array);
          expect(copy[0]).toEqual(array[1]);
          expect(copy[1]).toEqual(array[2]);
          expect(copy[2]).toEqual(array[3]);
          expect(copy.length).toEqual(2)
        });
      })
    });
    describe('when given two arguments - start index and offset', function() {
      describe('and offset is a small number', function() {
      });
      describe('and offset is a number that is larger than the length of array', function() {
        it ("should copy array from offset ")
      });
    })
  })
  describe('indexOf', function() {
    describe('in array of primitives', function() {
      describe('when given a primitive', function() {
        it('should return value index', function() {
          var array = new LSD.Array(1, 2, 3);
          expect(array.indexOf(1)).toEqual(0);
          expect(array.indexOf('1')).toEqual(-1);
          expect(array.indexOf(3)).toEqual(2);
          expect(array.indexOf(4)).toEqual(-1);
        })
      })
    });
    describe('in array of objects', function() {
      describe('each having id attribute', function() {
        describe('when given a primitive', function() {
          it ("should find object with that as an id", function() {
            var array = new LSD.Array({id: 'George', title: 'Scientist'}, {id: 'Jack', title: 'Singer'}, {id: 0, title: 'Player'}, {title: 'Hustler'});
            expect(array.indexOf(33)).toEqual(-1);
            expect(array.indexOf(0)).toEqual(2);
            expect(array.indexOf('George')).toEqual(0);
            expect(array.indexOf('Jack')).toEqual(1);
            expect(array.indexOf('Hustler')).toEqual(-1);
          })
        })
        describe('when given an object', function() {
          describe('with id attribute', function() {
            it ("should find that object by id or by identicity", function() {
              var george = {id: 'George', title: 'Scientist'}, josh = {id: 'Josh', title: 'Singer'};
              var array = new LSD.Array(george, {id: 'Jack', title: 'Singer'}, {id: 0, title: 'Player'}, {title: 'Hustler'});
              expect(array.indexOf({id: 33})).toEqual(-1);
              expect(array.indexOf({id: 0})).toEqual(2);
            })
          })
          describe('without id attribute', function() {
            it ("should only find object by identicity", function() {
              var george = {name: 'George', title: 'Scientist'}, jack = {name: 'Jack', title: 'Singer'};
              var array = new LSD.Array(george, {name: 'Jack', title: 'Singer'}, {name: 0, title: 'Player'}, {name: 'Hustler'});
              expect(array.indexOf(george)).toEqual(0);
              expect(array.indexOf(jack)).toEqual(-1);
              expect(array.indexOf({id: 'Jack', title: 'Singer'})).toEqual(-1);
            })
          })
        })
      })
      describe('and none of them have id attribute', function() {
        describe('when given a primitive', function() {
          it ("should not find anything", function() {
            var array = new LSD.Array({name: 'George', title: 'Scientist'}, {name: 'Jack', title: 'Singer'});
            expect(array.indexOf(33)).toEqual(-1);
            expect(array.indexOf('George')).toEqual(-1);
          })
        })
        describe('when given an object', function() {
          describe('with id attribute', function() {
            it ("should not find anything", function() {
              var george = {name: 33};
              var array = new LSD.Array(george, {name: 'Jack'});
              expect(array.indexOf({id: 33})).toEqual(-1);
              expect(array.indexOf({id: 'Jack'})).toEqual(-1);
            })
          })
          describe('without id attribute', function() {
            it ("should only find object by identicity", function() {
              var george = {name: 33};
              var array = new LSD.Array(george, {name: 'Jack'});
              expect(array.indexOf({id: 33})).toEqual(-1);
              expect(array.indexOf({id: 'Jack'})).toEqual(-1);
            })
          })
        })
      })
    });
  });
  
  describe('splice', function() {
    describe('when given no arguments', function() {
      it ("should remove all elements from array and return them in a new array", function() {
        var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
        expect(array.splice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        expect(array.slice()).toEqual([])
      })
    })
    describe('when given zero index', function() {
      describe('and offset is not given', function() {
        it ('should remove all elements from array and return them in a new array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(0)).toEqual(['A', 'B', 'C', 'D', 'E'])
          expect(array.slice()).toEqual([])
        })
      })
      describe('and offset is zero', function() {
        it ('should do nothing to array and return empty array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(0, 0)).toEqual([])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        })
      });
      describe('and offset is non zero', function() {
        it ('should remove `offset` number of elements from original array and return them', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(0, 2)).toEqual(['A', 'B'])
          expect(array.slice()).toEqual(['C', 'D', 'E'])
        })
      });
      describe('and offset is negative', function() {
        it ('should do nothing to array and return empty array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(0, -1)).toEqual([])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        })
      });
      describe('and offset is too large', function() {
        it ('should ignore the large offset and just return removed elements', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(0, 10)).toEqual(['A', 'B', 'C', 'D', 'E'])
          expect(array.slice()).toEqual([])
        })
      })
    });
    describe('when given non zero index', function() {
      describe('and offset is not given', function() {
        it ('should remove all elements starting from index and return them', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(1)).toEqual(['B', 'C', 'D', 'E'])
          expect(array.slice()).toEqual(['A'])
        })
      })
      describe('and offset is zero', function() {
        it ('should do nothing to array and return empty array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(1, 0)).toEqual([])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        })
      });
      describe('and offset is non zero', function() {
        it ('should return `offset` number of elements from array starting from `index` and return them', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(1, 2)).toEqual(['B', 'C'])
          expect(array.slice()).toEqual(['A', 'D', 'E'])
        })
      });
      describe('and offset is negative', function() {
        it ('should do nothing to array and return empty array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(1, -1)).toEqual([])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        })
      });
      describe('and offset is too large', function() {
        it ('should ignore the large offset and just return removed elements', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(1, 10)).toEqual(['B', 'C', 'D', 'E'])
          expect(array.slice()).toEqual(['A'])
        })
      });
    })
    describe('when given negative index', function() {
      describe('and offset is not given', function() {
        it ('should remove all elements starting from `index`th element from the end and return them', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(-2)).toEqual(['D', 'E'])
          expect(array.slice()).toEqual(['A', 'B', 'C'])
        })
      })
      describe('and offset is zero', function() {
        it ('should do nothing to array and return empty array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(-2, 0)).toEqual([])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        })
      });
      describe('and offset is non zero', function() {
        it ('should return `offset` number of elements from array starting from `index` and return them', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(-2, 1)).toEqual(['D'])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'E'])
        })
      });
      describe('and offset is negative', function() {
        it ('should do nothing to array and return empty array', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(-1, -1)).toEqual([])
          expect(array.slice()).toEqual(['A', 'B', 'C', 'D', 'E'])
        })
      });
      describe('and offset is too large', function() {
        it ('should ignore the large offset and just return removed elements', function() {
          var array = new LSD.Array('A', 'B', 'C', 'D', 'E');
          expect(array.splice(-2, 5)).toEqual(['D', 'E'])
          expect(array.slice()).toEqual(['A', 'B', 'C'])
        })
      });
    });
    describe('when given index larger than length of array', function() {
      
    })
  })
  
  describe('#filter', function() {
    it ("should create persistent filtered javascript", function() {
      var ary = new LSD.Array({name: 'Jack'}, {name: "George"}, {name: 'Josh'});
      var filtered = ary.filter(new LSD.Function('item', 'item.name.charAt(0) == "J"'), true);
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'Josh'}])
      ary.push({name: 'McCaliger'})
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'Josh'}])
      ary.push({name: 'John'})
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'Josh'}, {name: 'John'}])
      ary.splice(1, 1)
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'Josh'}, {name: 'John'}])
      ary.splice(1, 1)
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'John'}])
      expect(ary.length).toEqual(3);
      ary.push({name: 'Harry'})
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'John'}])
      expect(ary.length).toEqual(4);
      ary.push({name: 'Jesus'})
      expect(ary.length).toEqual(5);
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'John'}, {name: 'Jesus'}])
      ary.push({name: 'Jackie'})
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'John'}, {name: 'Jesus'}, {name: 'Jackie'}]);
      var harry = ary.splice(-3, 1)[0]
      expect(filtered).toEqual([{name: 'Jack'}, {name: 'John'}, {name: 'Jesus'}, {name: 'Jackie'}]);
      ary.splice(0, 1, harry);
      expect(filtered).toEqual([{name: 'John'}, {name: 'Jesus'}, {name: 'Jackie'}]);
      ary.splice(3, 1, {name: 'Johan'});
      expect(filtered).toEqual([{name: 'John'}, {name: 'Johan'}, {name: 'Jackie'}]);
      window.$spliced = true
      ary.splice(3, 1, {name: 'Johan'});
      expect(filtered).toEqual([{name: 'John'}, {name: 'Johan'}, {name: 'Jackie'}]);
      ary.splice(3, 1);
      expect(filtered).toEqual([{name: 'John'}, {name: 'Jackie'}]);
      ary.splice(0, 1);
      expect(filtered).toEqual([{name: 'John'}, {name: 'Jackie'}]);
      ary.splice(0, 2, {name: 'Jeff'}, {name: 'Howard'}, {name: 'Jephrey'});
      expect(filtered).toEqual([{name: 'Jeff'}, {name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(0, 0, {name: 'Griffin'});
      expect(filtered).toEqual([{name: 'Jeff'}, {name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(0, 0, {name: 'Gordon'}, {name: 'Greg'});
      expect(filtered).toEqual([{name: 'Jeff'}, {name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(0, 4, {name: 'George'});
      expect(filtered).toEqual([{name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(3, 0, {name: 'Jennifer'}, {name: 'Gonzales'}, {name: 'Jannet'});
      expect(filtered).toEqual([{name: 'Jephrey'}, {name: 'Jennifer'}, {name: 'Jannet'}, {name: 'Jackie'}]);
      ary.splice(1, 2, {name: 'Julia'});
      expect(filtered).toEqual([{name: 'Julia'}, {name: 'Jennifer'}, {name: 'Jannet'}, {name: 'Jackie'}]);
      ary.splice(1, 1);
      expect(filtered).toEqual([{name: 'Jennifer'}, {name: 'Jannet'}, {name: 'Jackie'}]);
      ary.splice(-1, 1);
      expect(filtered).toEqual([{name: 'Jennifer'}, {name: 'Jannet'}]);
      ary.splice(-1, 1, {name: 'Christian'}, {name: 'Jagger'});
      expect(filtered).toEqual([{name: 'Jennifer'}, {name: 'Jagger'}]);
      ary.splice(-1, 2, {name: 'Justin'});
      expect(filtered).toEqual([{name: 'Jennifer'}, {name: 'Justin'}]);
      ary.splice(0, 2, {name: 'Hoffman'});
      expect(filtered).toEqual([{name: 'Justin'}]);
      ary.splice(1, 2, {name: 'Jenkins'});
      expect(filtered).toEqual([{name: 'Jenkins'}, {name: 'Justin'}]);
      var justin = ary.pop();
      expect(filtered).toEqual([{name: 'Jenkins'}]);
      ary.pop();
      expect(filtered).toEqual([]);
      ary.pop();
      expect(filtered).toEqual([]);
      expect(ary.length).toEqual(0);
      expect(filtered.length).toEqual(0);
      expect(ary[1]).toBeUndefined();
      ary.push({name: 'Jeeves'})
      expect(filtered).toEqual([{name: 'Jeeves'}]);
    })
    
    it ("should create persistent filtered LSD arrays", function() {
      var ary = new LSD.Array({name: 'Jack'}, {name: "George"}, {name: 'Josh'});
      var filtered = ary.filter(new LSD.Function('item', 'item.name.charAt(0) == "J"'));
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'Josh'}])
      ary.push({name: 'McCaliger'})
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'Josh'}])
      ary.push({name: 'John'})
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'Josh'}, {name: 'John'}])
      ary.splice(1, 1)
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'Josh'}, {name: 'John'}])
      ary.splice(1, 1)
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'John'}])
      expect(ary.length).toEqual(3);
      ary.push({name: 'Harry'})
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'John'}])
      expect(ary.length).toEqual(4);
      ary.push({name: 'Jesus'})
      expect(ary.length).toEqual(5);
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'John'}, {name: 'Jesus'}])
      ary.push({name: 'Jackie'})
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'John'}, {name: 'Jesus'}, {name: 'Jackie'}]);
      var harry = ary.splice(-3, 1)[0]
      expect(filtered.slice()).toEqual([{name: 'Jack'}, {name: 'John'}, {name: 'Jesus'}, {name: 'Jackie'}]);
      ary.splice(0, 1, harry);
      expect(filtered.slice()).toEqual([{name: 'John'}, {name: 'Jesus'}, {name: 'Jackie'}]);
      ary.splice(3, 1, {name: 'Johan'});
      expect(filtered.slice()).toEqual([{name: 'John'}, {name: 'Johan'}, {name: 'Jackie'}]);
      window.$spliced = true
      ary.splice(3, 1, {name: 'Johan'});
      expect(filtered.slice()).toEqual([{name: 'John'}, {name: 'Johan'}, {name: 'Jackie'}]);
      ary.splice(3, 1);
      expect(filtered.slice()).toEqual([{name: 'John'}, {name: 'Jackie'}]);
      ary.splice(0, 1);
      expect(filtered.slice()).toEqual([{name: 'John'}, {name: 'Jackie'}]);
      ary.splice(0, 2, {name: 'Jeff'}, {name: 'Howard'}, {name: 'Jephrey'});
      expect(filtered.slice()).toEqual([{name: 'Jeff'}, {name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(0, 0, {name: 'Griffin'});
      expect(filtered.slice()).toEqual([{name: 'Jeff'}, {name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(0, 0, {name: 'Gordon'}, {name: 'Greg'});
      expect(filtered.slice()).toEqual([{name: 'Jeff'}, {name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(0, 4, {name: 'George'});
      expect(filtered.slice()).toEqual([{name: 'Jephrey'}, {name: 'Jackie'}]);
      ary.splice(3, 0, {name: 'Jennifer'}, {name: 'Gonzales'}, {name: 'Jannet'});
      expect(filtered.slice()).toEqual([{name: 'Jephrey'}, {name: 'Jennifer'}, {name: 'Jannet'}, {name: 'Jackie'}]);
      ary.splice(1, 2, {name: 'Julia'});
      expect(filtered.slice()).toEqual([{name: 'Julia'}, {name: 'Jennifer'}, {name: 'Jannet'}, {name: 'Jackie'}]);
      ary.splice(1, 1);
      expect(filtered.slice()).toEqual([{name: 'Jennifer'}, {name: 'Jannet'}, {name: 'Jackie'}]);
      ary.splice(-1, 1);
      expect(filtered.slice()).toEqual([{name: 'Jennifer'}, {name: 'Jannet'}]);
      ary.splice(-1, 1, {name: 'Christian'}, {name: 'Jagger'});
      expect(filtered.slice()).toEqual([{name: 'Jennifer'}, {name: 'Jagger'}]);
      ary.splice(-1, 2, {name: 'Justin'});
      expect(filtered.slice()).toEqual([{name: 'Jennifer'}, {name: 'Justin'}]);
      ary.splice(0, 2, {name: 'Hoffman'});
      expect(filtered.slice()).toEqual([{name: 'Justin'}]);
      ary.splice(1, 2, {name: 'Jenkins'});
      expect(filtered.slice()).toEqual([{name: 'Jenkins'}, {name: 'Justin'}]);
      var justin = ary.pop();
      expect(filtered.slice()).toEqual([{name: 'Jenkins'}]);
      ary.pop();
      expect(filtered.slice()).toEqual([]);
      ary.pop();
      expect(filtered.slice()).toEqual([]);
      expect(ary.length).toEqual(0);
      expect(filtered.length).toEqual(0);
      expect(ary[1]).toBeUndefined();
      ary.push({name: 'Jeeves'})
      expect(filtered.slice()).toEqual([{name: 'Jeeves'}]);
    })
  });
  
  describe('#map', function() {
    it ("should apply a results of calling callback upon each element of array", function() {
      var array = new LSD.Array({name: 'Jack'}, {name: 'George'}, {id: 'Jack'});
      expect(array.map(function(value) {
        return value.name;
      })).toEqual(['Jack', 'George', window.z0z0z0undefined])
    })
  });
  
  describe ('#sort', function() {
    it ("should create persistent sorted collection", function() {
      var array = new LSD.Array();
      var sorted = array.sort();
      array.push('Howard');
      expect(sorted.slice(0)).toEqual(['Howard'])
      array.push('Adolf');
      expect(sorted.slice(0)).toEqual(['Adolf', 'Howard'])
      array.push('Herfer');
      expect(sorted.slice(0)).toEqual(['Adolf', 'Herfer', 'Howard']);
      array.shift();
      expect(sorted.slice(0)).toEqual(['Adolf', 'Herfer']);
      array.splice(1, 0, 'Zack')
      expect(sorted.slice(0)).toEqual(['Adolf', 'Herfer', 'Zack']);
      array.splice(1, 0, 'Zoey', 'Xena')
      expect(sorted.slice(0)).toEqual(['Adolf', 'Herfer', 'Xena', 'Zack', 'Zoey']);
      array.splice(0, 1)
      expect(sorted.slice(0)).toEqual(['Herfer', 'Xena', 'Zack', 'Zoey']);
      array.splice(1, 2)
      expect(sorted.slice(0)).toEqual(['Herfer', 'Zoey']);
      array.unshift('Hanz', 'Andy', 'Wiggley', 'Zuzan');
      expect(sorted.slice(0)).toEqual(['Andy', 'Hanz', 'Herfer', 'Wiggley', 'Zoey', 'Zuzan']);
      array.splice(2, 3, 'Xoop', 'Yu')
      expect(sorted.slice(0)).toEqual(['Andy', 'Hanz', 'Herfer', 'Xoop', 'Yu']);
    });
    
    describe('paired with filter', function() {
      it ("should sort results of filter function", function() {
        var array = new LSD.Array(4, 2, 8, 5, 1, 7, 6, 3, 10, 9);
        var filtered = array.filter(new LSD.Function('number', 'number % 2 == 0'));
        var sorted = filtered.sort()
        expect(filtered.slice()).toEqual([4, 2, 8, 6, 10])
        expect(sorted.slice()).toEqual([2, 4, 6, 8, 10])
        array.splice(2, 5, 11, 18, 16, 3, 6)
        expect(filtered.slice()).toEqual([4, 2, 18, 16, 6, 10])
        expect(sorted.slice()).toEqual([2, 4, 6, 10, 16, 18])
      })
    })
  });
});