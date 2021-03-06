
describe("LSD.Fragment", function() {
  describe("constructor", function() {
    describe('when given no arguments', function() {
      it ("should create empty fragment", function() {
        
      })
    });
    describe('when given widget', function() {
      it ("should create a fragment with a single widget", function() {
        
      })
    })
    describe('when given a node', function() {
      it ("should create a fragment with a text element", function() {
        
      })
    })
    describe('when given multiple nodes', function() {
      it ("should create a fragment with those nodes", function() {
        
      })
    })
    describe('when given node collection', function() {
      it ("should create a fragment elements of the node collection", function() {
        
      })
      describe('and other nodes', function() {
        it ("should create a fragment with elements of node collection and other nodes together", function() {

        })
      })
    })
    describe('when given document fragment', function() {
      it("should create a fragment with nodes of the given fragment", function() {
        
      });
      describe('and other nodes', function() {
        it ("should create a fragment with nodes of the given fragment and other nodes together", function() {

        })
      })
    });
    describe('when given html', function() {
      it("should parse html and create a fragment with nodes parsed from html", function() {
        
      })
    });
    describe('when given object', function() {
      it("create a nodes of all keys in the object", function() {
        
      })
    })
  });
  describe('#render', function() {
    describe('when given string', function() {
      it ("should render text node", function() {
        var fragment = new LSD.Fragment;
        fragment.render('Gold Digger');
        expect(fragment.childNodes[0].nodeType).toEqual(3);
        expect(fragment.childNodes[0].textContent).toEqual('Gold Digger');
      });
      describe('and string contains html', function() {
        it ("should parse html and render widgets", function() {
          var fragment = new LSD.Fragment('<b>Gold</b> Digger');
          expect(fragment.childNodes[0].nodeType).toEqual(1);
          expect(fragment.childNodes[0].nodeName).toEqual('b');
          expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Gold');
        })
        describe('and html contains interpolations', function() {
          it ("should parse interpolations", function() {
            var fragment = new LSD.Fragment('<b>Oh, ${metal}, lawd</b> Digger');
            expect(fragment.childNodes[0].nodeType).toEqual(1);
            expect(fragment.childNodes[0].nodeName).toEqual('b');
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, ${metal}, lawd');
            fragment.childNodes[0].set('variables.metal', 'Gold')
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, Gold, lawd');
            fragment.childNodes[0].variables.change('metal', 'Silver')
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, Silver, lawd');
            fragment.childNodes[0].unset('variables.metal', 'Silver')
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, ${metal}, lawd');
          })
          xit ("should parse interpolations", function() {
            var fragment = new LSD.Fragment('<section ${jungalo: dang}></section>');
            expect(fragment.childNodes[0].nodeType).toEqual(1);
            expect(fragment.childNodes[0].nodeName).toEqual('b');
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, ${metal}, lawd');
            fragment.childNodes[0].set('variables.metal', 'Gold')
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, Gold, lawd');
            fragment.childNodes[0].variables.change('metal', 'Silver')
            expect(fragment.childNodes[0].childNodes[0].textContent).toEqual('Oh, Silver, lawd');
          })
        })
        describe('and html contains conditional comments', function() {
          it ("should parse comments and interpolate them", function() {
            var fragment = new LSD.Fragment('\
              <!-- if a > 1 -->\
                <!-- if urgency -->\
                  <h2>This is so urgent..</h2>\
                <!-- else -->\
                  <h2>This is not urgent, but hell, we need this today</h2>\
                <!-- end -->\
              <!-- else -->\
                <!-- unless urgency -->\
                  <h3>That only takes 5 minutes to do! Come on, copy and paste what we have already</h3>\
                <!-- else -->\
                    <h3>I want it right now</h3>\
                <!-- end -->\
              <!-- end -->\
            ')
            var parent = new LSD.Element;
            parent.appendChild(fragment)
            var getText = function() {
              return parent.textContent.replace(/^\s+|\s+$/g, '')
            }
            console.log(fragment[2][1].next.parentNode, fragment[2][2].parentNode)
            expect(getText()).toEqual('That only takes 5 minutes to do! Come on, copy and paste what we have already');
            zzz = true;
            parent.set('variables.urgency', true);
            console.log(fragment[2][1].next.parentNode, fragment[2][2].parentNode)
            expect(getText()).toEqual('I want it right now');
            //parent.unset('variables.urgency')
            //expect(getText()).toEqual('That only takes 5 minutes to do! Come on, copy and paste what we have already');
            //parent.set('variables.urgency', true);
            //expect(getText()).toEqual('I want it right now');
            //parent.unset('variables.urgency')
            //expect(getText()).toEqual('That only takes 5 minutes to do! Come on, copy and paste what we have already');
            //parent.set('variables.a', 2);
            //expect(getText()).toEqual('This is not urgent, but hell, we need this today');
            //parent.set('variables.urgency', true);
            //expect(getText()).toEqual('This is so urgent..');
            //parent.set('variables.a', 1);
            //expect(getText()).toEqual('I want it right now');
            //parent.set('variables.a', 2);
            //expect(getText()).toEqual('This is so urgent..');
            //parent.unset('variables.urgency')
            //expect(getText()).toEqual('This is not urgent, but hell, we need this today');
          })
          describe("and multiple conditions linked together are used", function() {
            xit ("should show conditional blocks at the place", function() {
              var fragment = new LSD.Fragment('\
              <div>                           \
              <!-- if condition -->           \
                <section><div><div><form>     \
                  <!-- unless chill -->       \
                  Very                        \
                  <!-- end -->                \
                  <!-- if good -->            \
                    Good                      \
                    <!-- if time < 6 -->      \
                      Night                   \
                    <!-- elsif time < 12 -->  \
                      Morning                 \
                    <!-- elsif time < 18 -->  \
                      Day                     \
                    <!-- else -->             \
                      Evening                 \
                    <!-- end -->              \
                    <!-- if mom -->           \
                      <!-- if respect -->     \
                        Mother                \
                      <!-- else -->           \
                        Mom                   \
                      <!-- end -->            \
                    <!-- else -->             \
                      <!-- if respect -->     \
                        Father                \
                      <!-- else -->           \
                        Dad                   \
                      <!-- end -->            \
                    <!-- end -->              \
                  <!-- else -->               \
                    Bad                       \
                    <!-- if time < 6 -->      \
                      Night                   \
                    <!-- elsif time < 12 -->  \
                      Morning                 \
                    <!-- elsif time < 18 -->  \
                      Day                     \
                    <!-- else -->             \
                      Evening                 \
                    <!-- end -->              \
                    <!-- if mom -->           \
                      <!-- if respect -->     \
                        Mother                \
                      <!-- else -->           \
                        Mom                   \
                      <!-- end -->            \
                    <!-- else -->             \
                      <!-- if respect -->     \
                        Father                \
                      <!-- else -->           \
                        Dad                   \
                      <!-- end -->            \
                    <!-- end -->              \
                  <!-- end -->                \
                </div></div></form></section> \
              <!-- end -->                    \
              </div>                          ')
              
              var parent = new LSD.Element;
              parent.appendChild(fragment)
              var getText = function() {
                return parent.textContent.replace(/^\s+|\s+$/g, '')
              }
              expect(getText()).toEqual('');
              parent.set('variables.condition', true);
              expect(getText()).toEqual('Very Bad Evening Dad');
              parent.set('variables.time', 11);
              expect(getText()).toEqual('Very Bad Morning Dad');
              parent.set('variables.good', true);
              expect(getText()).toEqual('Very Good Morning Dad');
              parent.set('variables.good', false);
              expect(getText()).toEqual('Very Bad Morning Dad');
              parent.set('variables.time', 13);
              expect(getText()).toEqual('Very Bad Day Dad');
              parent.set('variables.mom', true);
              expect(getText()).toEqual('Very Bad Day Mom');
              parent.set('variables.good', true);
              expect(getText()).toEqual('Very Good Day Mom');
              parent.set('variables.good', false);
              expect(getText()).toEqual('Very Bad Day Mom');
              parent.set('variables.respect', false);
              expect(getText()).toEqual('Very Bad Day Mom');
              parent.set('variables.respect', true);
              expect(getText()).toEqual('Very Bad Day Mother');
              parent.set('variables.good', true);
              expect(getText()).toEqual('Very Good Day Mother');
              parent.set('variables.good', false);
              expect(getText()).toEqual('Very Bad Day Mother');
              parent.set('variables.mom', false);
              expect(getText()).toEqual('Very Bad Day Father');
              parent.set('variables.condition', false);
              expect(getText()).toEqual('');
              parent.set('variables.condition', true);
              expect(getText()).toEqual('Very Bad Day Father');
              parent.set('variables.respect', false);
              expect(getText()).toEqual('Very Bad Day Dad');
              parent.set('variables.mom', true);
              expect(getText()).toEqual('Very Bad Day Mom');
              parent.set('variables.good', true);
              expect(getText()).toEqual('Very Good Day Mom');
              parent.set('variables.time', 4);
              expect(getText()).toEqual('Very Good Night Mom');
              parent.set('variables.chill', true);
              expect(getText()).toEqual('Good Night Mom');
              parent.set('variables.time', 23);
              expect(getText()).toEqual('Good Evening Mom');
              parent.set('variables.good', false);
              expect(getText()).toEqual('Bad Evening Mom');
              parent.set('variables.respect', true);
              expect(getText()).toEqual('Bad Evening Mother');
              parent.set('variables.mom', false);
              expect(getText()).toEqual('Bad Evening Father');
              parent.set('variables.chill', false);
              expect(getText()).toEqual('Very Bad Evening Father');
              parent.set('variables.respect', false);
              expect(getText()).toEqual('Very Bad Evening Dad');
              parent.set('variables.time', 13);
              expect(getText()).toEqual('Very Bad Day Dad');
            })
          })
          
          it ("should recognize conditional branches in HTML and render widgets accordingly", function() {
            var fragment = new LSD.Fragment('<!--if a-->1<!--else-->2<!--end-->'); 
            expect(fragment.variables).toBeUndefined()
            var parent = new LSD.Element;
            parent.appendChild(fragment);
            expect(parent.textContent).toBe('2')
            expect(fragment.variables).toBe(parent.variables);
            expect(fragment.childNodes[0].variables).toBe(parent.variables);
            expect(fragment.childNodes[1].variables).toBe(parent.variables);
            parent.set('variables.a', 2)
            expect(parent.textContent).toBe('1')
            expect(fragment.variables).toBe(parent.variables);
            expect(fragment.parentNode).toBe(parent);
            expect(fragment.childNodes[0].variables).toBe(parent.variables);
            expect(fragment.childNodes[1].variables).toBe(parent.variables);
            expect(parent.childNodes[2].fragment).toBe(parent.childNodes[1])
            expect(parent.childNodes[2].fragment.fragment).toBe(fragment)
            expect(parent.childNodes[2].nodeType).toEqual(3);
            expect(parent.childNodes[3].nodeType).toEqual(7);
            expect(parent.childNodes[4].nodeType).toEqual(7);
            parent.set('variables.a', 0)
            expect(parent.textContent).toBe('2')
            expect(parent.childNodes[2].nodeType).toEqual(7);
            expect(parent.childNodes[3].nodeType).toEqual(3);
            expect(parent.childNodes[4].nodeType).toEqual(7);
            parent.set('variables.a', 2)
            expect(parent.textContent).toBe('1')
            expect(parent.childNodes[2].nodeType).toEqual(3);
            expect(parent.childNodes[3].nodeType).toEqual(7);
            expect(parent.childNodes[4].nodeType).toEqual(7);
            parent.set('variables.a', 0)
            expect(parent.textContent).toBe('2')
            expect(parent.childNodes[2].nodeType).toEqual(7);
            expect(parent.childNodes[3].nodeType).toEqual(3);
            expect(parent.childNodes[4].nodeType).toEqual(7);
          });
          it ("should recognize nested conditional branches in HTML and render widgets accordingly 3", function() {
            var fragment = new LSD.Fragment('<!--if a-->1<!--else--><!--if b -->2<!--elsif c -->3<!--else-->4<!--end--><!--end-->');
            var parent = new LSD.Element;
            parent.appendChild(fragment);
            expect(parent.textContent).toBe('4')
            parent.set('variables.b', true)
            expect(parent.textContent).toBe('2')
            parent.set('variables.c', true)
            expect(parent.textContent).toBe('2')
            parent.unset('variables.b', true)
            expect(parent.textContent).toBe('3')
            parent.set('variables.a', true)
            expect(parent.textContent).toBe('1')
            parent.unset('variables.a', true);
            expect(parent.textContent).toBe('3')
            parent.unset('variables.c', true)
            expect(parent.textContent).toBe('4')
            parent.set('variables.a', true)
            expect(parent.textContent).toBe('1')
            parent.set('variables.b', true)
            expect(parent.textContent).toBe('1')
            parent.unset('variables.a', true);
            expect(parent.textContent).toBe('2')
            parent.unset('variables.b', true);
            expect(parent.textContent).toBe('4')
            parent.set('variables.c', true);
            expect(parent.textContent).toBe('3')
            parent.set('variables.b', true);
            expect(parent.textContent).toBe('2')
            parent.unset('variables.c', true);
            expect(parent.textContent).toBe('2')
            parent.unset('variables.b', true);
            expect(parent.textContent).toBe('4')
          });
          it ("should recognize nested conditional branches in HTML and render widgets accordingly 1", function() {
            var fragment =new LSD.Fragment('<!--if a-->'           +
                                              '1'                  +
                                           '<!--else-->'           +
                                              '<div>'              +
                                                '<!--if b -->'     +
                                                  '2'              +
                                                '<!--elsif c -->'  +
                                                  '3'              +
                                                '<!--else-->'      +
                                                  '4'              +
                                                '<!--end-->'       +
                                              '</div>'             +
                                            '<!--end-->');
            var parent = new LSD.Element;
            parent.appendChild(fragment);
            expect(parent.textContent).toBe('4')
            parent.set('variables.b', true)
            expect(parent.textContent).toBe('2')
            parent.set('variables.c', true)
            expect(parent.textContent).toBe('2')
            parent.unset('variables.b', true)
            expect(parent.textContent).toBe('3')
            parent.set('variables.a', true)
            expect(parent.textContent).toBe('1')
            parent.unset('variables.a', true);
            expect(parent.textContent).toBe('3')
            parent.unset('variables.c', true)
            expect(parent.textContent).toBe('4')
            parent.set('variables.a', true)
            expect(parent.textContent).toBe('1')
            parent.set('variables.b', true)
            expect(parent.textContent).toBe('1')
            parent.unset('variables.a', true);
            expect(parent.textContent).toBe('2')
            parent.unset('variables.b', true);
            expect(parent.textContent).toBe('4')
            parent.set('variables.c', true);
            expect(parent.textContent).toBe('3')
            parent.set('variables.b', true);
            expect(parent.textContent).toBe('2')
            parent.unset('variables.c', true);
            expect(parent.textContent).toBe('2')
            parent.unset('variables.b', true);
            expect(parent.textContent).toBe('4')
          });
          it ("should recognize nested conditional branches in HTML and render widgets accordingly", function() {
            var fragment = new LSD.Fragment('<!--if a-->1<!--else--><!--if b -->2<!--elsif c -->3<!--else-->4<!--end--><!--end--><!--if a-->1<!--else--><!--if b -->2<!--elsif c -->3<!--else-->4<!--end--><!--end-->');
            var parent = new LSD.Element;
            parent.appendChild(fragment);
            expect(parent.childNodes[0].nodeType).toBe(11)
            expect(parent.childNodes[1].nodeType).toBe(7)
            expect(parent.childNodes[2].nodeType).toBe(7)
            expect(parent.childNodes[3].nodeType).toBe(7)
            expect(parent.childNodes[4].nodeType).toBe(7)
            expect(parent.textContent).toBe('44')
            parent.set('variables.b', true)
            expect(parent.textContent).toBe('22')
            parent.set('variables.c', true)
            expect(parent.textContent).toBe('22')
            parent.unset('variables.b', true)
            expect(parent.textContent).toBe('33')
            parent.set('variables.a', true)
            expect(parent.textContent).toBe('11')
            parent.unset('variables.a', true);
            expect(parent.textContent).toBe('33')
            parent.unset('variables.c', true)
            expect(parent.textContent).toBe('44')
            parent.set('variables.a', true)
            expect(parent.textContent).toBe('11')
            parent.set('variables.b', true)
            expect(parent.textContent).toBe('11')
            parent.unset('variables.a', true);
            expect(parent.textContent).toBe('22')
            parent.unset('variables.b', true);
            expect(parent.textContent).toBe('44')
            parent.set('variables.c', true);
            expect(parent.textContent).toBe('33')
            parent.set('variables.b', true);
            expect(parent.textContent).toBe('22')
            parent.unset('variables.c', true);
            expect(parent.textContent).toBe('22')
            parent.unset('variables.b', true);
            expect(parent.textContent).toBe('44')
          });
          it ('should handle deeply nested conditionals', function() {
            var fragment = new LSD.Fragment( '\
            <div>                           \
            <!-- if condition -->           \
              <section><div><div><form>     \
                <!-- if a -->               \
                <section><div>              \
                ${a}                        \
                <!-- if b -->               \
                <section><div>              \
                ${b}                        \
                <!-- if c -->               \
                <section><div>              \
                ${c}                        \
                <!-- if d -->               \
                <section><div>              \
                ${d}                        \
                </div></section>            \
                <!-- end -->                \
                </div></section>            \
                <!-- end -->                \
                </div></section>            \
                <!-- end -->                \
                </div></section>            \
                <!-- end -->                \
              </div></div></form></section> \
            <!-- end -->                    \
            </div>                          ')
            var parent = new LSD.Element
            parent.appendChild(fragment);
            var getText = function() {
              return parent.textContent.replace(/[\s\n]+|\s*$|^\s*/gm, '');
            }
            expect(getText()).toBe('');
            parent.set('variables.condition', true);
            expect(getText()).toBe('');
            parent.set('variables.a', 'A');
            expect(getText()).toBe('A');
            parent.set('variables.b', 'B');
            expect(getText()).toBe('AB');
            parent.set('variables.c', 'C');
            expect(getText()).toBe('ABC');
            parent.set('variables.d', 'D');
            expect(getText()).toBe('ABCD');
            parent.unset('variables.c', 'C');
            expect(getText()).toBe('AB');
            parent.unset('variables.a', 'A');
            expect(getText()).toBe('');
            parent.set('variables.c', 'C');
            expect(getText()).toBe('');
            parent.set('variables.a', 'A');
            expect(getText()).toBe('ABCD');
            parent.unset('variables.a', 'A');
            expect(getText()).toBe('');
            parent.unset('variables.d', 'D');
            expect(getText()).toBe('');
            parent.set('variables.a', 'A');
            expect(getText()).toBe('ABC');
          })
          xit ("should handle nested conditions with else blocks", function() {
            var fragment = new LSD.Fragment( '\
              <div>                           \
              <!-- if condition -->           \
                <section><div><div><form>     \
                  <!-- if a -->               \
                  <section><div>              \
                  ${a}                        \
                  <!-- if b -->               \
                  <section><div>              \
                  ${b}                        \
                  <!-- if c -->               \
                  <section><div>              \
                  ${c}                        \
                  <!-- if d -->               \
                  <section><div>              \
                  ${d}                        \
                  </div></section>            \
                  <!-- else -->               \
                  X                           \
                  <!-- end -->                \
                  </div></section>            \
                  <!-- else -->               \
                  X                           \
                  <!-- end -->                \
                  </div></section>            \
                  <!-- else -->               \
                  X                           \
                  <!-- end -->                \
                  </div></section>            \
                  <!-- else -->               \
                  X                           \
                  <!-- end -->                \
                </div></div></form></section> \
              <!-- end -->                    \
              </div>                          ');
            var parent = new LSD.Element
            parent.appendChild(fragment);
            var getText = function() {
              return parent.textContent.replace(/[\s\n]+|\s*$|^\s*/gm, '');
            }
            expect(getText()).toBe('');
            parent.set('variables.condition', true);
            expect(getText()).toEqual('X')
            parent.set('variables.b', 2);
            expect(getText()).toEqual('X')
            parent.set('variables.a', 1);
            expect(getText()).toEqual('12X')
            parent.set('variables.c', 3);
            expect(getText()).toEqual('123X')
            parent.set('variables.b', 0);
            expect(getText()).toEqual('1X')
            parent.set('variables.d', 4);
            parent.set('variables.b', -2);
            expect(getText()).toEqual('1-234')
            parent.set('variables.condition', false)
            expect(getText()).toEqual('')
            parent.set('variables.b', 22);
            parent.set('variables.condition', true)
            expect(getText()).toEqual('12234')
            parent.set('variables.c', 4);
            expect(getText()).toEqual('12244')
            parent.set('variables.c', 0);
            expect(getText()).toEqual('122X')
          })
        })
      })
    })
    describe('when given object', function() {
      describe('with a single key', function() {
        it ('should render a single node', function() {
          var fragment = new LSD.Fragment;
          fragment.render({'button': 'Okay'});
          expect(fragment.childNodes[0].nodeType).toEqual(1);
          expect(fragment.childNodes[0].nodeName).toEqual('button');
          expect(fragment.childNodes.length).toEqual(1);
        })
      });
      describe('with multiple keys', function() {
        it ('should render nodes from keys of the object', function() {
          var fragment = new LSD.Fragment;
          fragment.render({'button': 'Okay', 'a.cancel': 'Cancel'});
          expect(fragment.childNodes[0].nodeType).toEqual(1);
          expect(fragment.childNodes[0].nodeName).toEqual('button');
          expect(fragment.childNodes[1].nodeType).toEqual(1);
          expect(fragment.childNodes[1].nodeName).toEqual('a');
          expect(fragment.childNodes[1].classList.cancel).toBeTruthy();
          expect(fragment.childNodes[1].className).toEqual('cancel')
          expect(fragment.childNodes[1].childNodes[0].textContent).toEqual('Cancel');
        })
      });
      describe('and it has a nested object', function() {
        describe('and the key to nested object contains keyword', function() {
          it ('should create an instruction for the keyword', function() {
            var fragment = new LSD.Fragment({
              'if (a > 1)': [
                {'button': 'JEEEZ'},
                {'if (b < 1)': 'Test'},
                {'else': 'blarghhh'},
                {'section': null}
              ],
              'else': {
                'button': 'Jeebz'
              },
              'footer': null
            });
            var el = new LSD.Element;
            el.appendChild(fragment);
            expect(el.textContent).toBe('Jeebz')
            el.set('variables.a', 2)
            expect(el.textContent).toBe('JEEEZblarghhh')
            el.set('variables.b', 0)
            expect(el.textContent).toBe('JEEEZTest')
            el.set('variables.a', 1)
            expect(el.textContent).toBe('Jeebz')
            el.set('variables.a', 2)
            expect(el.textContent).toBe('JEEEZTest')
          })
        })
      })
      describe('and there are conditional blocks in object', function() {
        it ("should recognize conditional branches in objects and render widgets accordingly 3", function() {
          var fragment = new LSD.Fragment({'if a': '1', 'else': '2'}); 
          expect(fragment.variables).toBeUndefined()
          var parent = new LSD.Element;
          parent.appendChild(fragment);
          expect(parent.childNodes[2].nodeType).toEqual(7);
          expect(parent.childNodes[3].nodeType).toEqual(3);
          expect(parent.textContent).toBe('2')
          parent.set('variables.a', 2)
          expect(parent.textContent).toBe('1')
          expect(fragment.variables).toBe(parent.variables);
          expect(fragment.parentNode).toBe(parent);
          expect(fragment.childNodes[0].variables).toBe(parent.variables);
          expect(fragment.childNodes[1].variables).toBe(parent.variables);
          expect(parent.childNodes[2].fragment).toBe(parent.childNodes[1])
          expect(parent.childNodes[2].fragment.fragment).toBe(fragment)
          expect(parent.childNodes[2].nodeType).toEqual(3);
          expect(parent.childNodes[3].nodeType).toEqual(7);
          parent.set('variables.a', 0)
          expect(parent.textContent).toBe('2')
          expect(parent.childNodes[2].nodeType).toEqual(7);
          expect(parent.childNodes[3].nodeType).toEqual(3);
          parent.set('variables.a', 2)
          expect(parent.textContent).toBe('1')
          expect(parent.childNodes[2].nodeType).toEqual(3);
          expect(parent.childNodes[3].nodeType).toEqual(7);
          parent.set('variables.a', 0)
          expect(parent.textContent).toBe('2')
          expect(parent.childNodes[2].nodeType).toEqual(7);
          expect(parent.childNodes[3].nodeType).toEqual(3);
        });
        it ("should recognize nested conditional branches in objects and render widgets accordingly", function() {
          var fragment = new LSD.Fragment({
            'if a':       '1',
            'else': {
              'if b':     '2',
              'elsif c':  '3',
              'else':     '4'
            }
          });
          expect(fragment.length).toEqual(2)
          var parent = new LSD.Element;
          parent.appendChild(fragment);
          expect(parent.childNodes[0].nodeType).toBe(11)
          expect(parent.childNodes[1].nodeType).toBe(7)
          expect(parent.childNodes[2].nodeType).toBe(7)
          expect(parent.childNodes[3].nodeType).toBe(7)
          expect(parent.childNodes[4].nodeType).toBe(7)
          expect(parent.textContent).toBe('4')
          parent.set('variables.b', true)
          expect(parent.textContent).toBe('2')
          parent.set('variables.c', true)
          expect(parent.textContent).toBe('2')
          parent.unset('variables.b', true)
          expect(parent.textContent).toBe('3')
          parent.set('variables.a', true);
          expect(parent.textContent).toBe('1')
          parent.unset('variables.a', true);
          expect(parent.textContent).toBe('3')
          parent.unset('variables.c', true)
          expect(parent.textContent).toBe('4')
          parent.set('variables.a', true)
          expect(parent.textContent).toBe('1')
          parent.set('variables.b', true)
          expect(parent.textContent).toBe('1')
          parent.unset('variables.a', true);
          expect(parent.textContent).toBe('2')
          parent.unset('variables.b', true);
          expect(parent.textContent).toBe('4')
          parent.set('variables.c', true);
          expect(parent.textContent).toBe('3')
          parent.set('variables.b', true);
          expect(parent.textContent).toBe('2')
          parent.unset('variables.c', true);
          expect(parent.textContent).toBe('2')
          parent.unset('variables.b', true);
          expect(parent.textContent).toBe('4')
          parent.set('variables.c', true);
          expect(parent.textContent).toBe('3')
        });
      })
    });
    describe('when given element', function() {
      describe('and .clone option is not given', function() {
        describe('and element is not a widget', function() {
          it ("should use that element", function() {
            var element = document.createElement('section');
            var fragment = new LSD.Fragment;
            fragment.render(element);
            expect(fragment.childNodes[0].origin).toEqual(element)
            expect(fragment.childNodes[0].tagName).toEqual('section')
            fragment.childNodes[0].build();
            expect(fragment.childNodes[0].element).toBe(element)
          })
        });
        describe('and element is a widget already', function() {
          it ("should append that widget into the fragment", function() {
            var widget = new LSD.Element;
            var element = widget.toElement();
            var fragment = new LSD.Fragment;
            fragment.render(element);
            expect(fragment.childNodes[0].origin).toBeUndefined()
            expect(fragment.childNodes[0].tagName).toEqual(null)
            fragment.childNodes[0].set('clone', true);
            fragment.childNodes[0].build();
            expect(fragment.childNodes[0]).toBe(widget);
            expect(fragment.childNodes[0].element).toBe(element);
            expect(fragment.childNodes[0].element.tagName).toEqual('DIV');
          })
        });
      })
      describe('and .clone option is given', function() {
        describe('and element is not a widget', function() {
          it ("should clone the element and create the widget", function() {
            var element = document.createElement('section');
            var fragment = new LSD.Fragment;
            fragment.render(element);
            expect(fragment.childNodes[0].origin).toEqual(element)
            expect(fragment.childNodes[0].tagName).toEqual('section')
            fragment.childNodes[0].set('clone', true);
            fragment.childNodes[0].build();
            expect(fragment.childNodes[0].element).toNotBe(element);
            expect(fragment.childNodes[0].element.tagName).toEqual('SECTION');
          })
        });
        describe('and element is a widget already', function() {
          it ("should clone the element and create the widget", function() {
            var widget = new LSD.Element({tagName: 'sexion', classes: {'a': true, 'b': true}});
            var element = widget.toElement();
            var fragment = new LSD.Fragment;
            fragment.render(element, null, {clone: true});
            expect(fragment.childNodes[0].tagName).toEqual('sexion')
            fragment.childNodes[0].build();
            expect(fragment.childNodes[0]).toNotBe(widget);
            expect(fragment.childNodes[0].element).toNotBe(element);
            expect(fragment.childNodes[0].element.className).toEqual('a b');
          })
        });
      })
    });
    describe('when given a tree of elements', function() {
      describe('and .clone option is given', function() {
        
      });
      describe('and .clone option is not given', function() {
        describe("and none of the elements are widgets", function() {
          it ("should walk the tree of elements and use each element to create a widget", function() {
            var form     = document.createElement('form');
            var fieldset = document.createElement('fieldset');
            var label    = document.createElement('label');
            form.appendChild(fieldset);
            form.appendChild(label); 
            var fragment = new LSD.Fragment(form);
            expect(fragment.childNodes[0].tagName).toEqual('form');
            expect(fragment.childNodes[0].childNodes[0].tagName).toEqual('fieldset');
            expect(fragment.childNodes[0].childNodes[1].tagName).toEqual('label');
            fragment.childNodes[0].build();
            expect(fragment.childNodes[0].element).toEqual(form)
            expect(fragment.childNodes[0].childNodes[0].element).toEqual(fieldset);
            expect(fragment.childNodes[0].childNodes[1].element).toEqual(label);
          })
        });
        describe("and some elements are widgets", function() {
          it ("should skip elements that are already widgets and initialize the rest", function() {
            
          })
        });
        describe("and all elements are widgets", function() {
          it ("should walk through elements and render nothing", function() {
            
          })
        })
      });
    })
    describe('when operated like a node', function() {
      it ('should be able to append and remove nodes', function() {
        var parent = new LSD.Element('parent');
        var a = new LSD.Element('a');
        var b = new LSD.Element('b');
        var c = new LSD.Element('c');
        var d = new LSD.Element('d');
        var e = new LSD.Element('e');
        var fragment = new LSD.Fragment(c, d);
        parent.appendChild(a);
        expect(parent.childNodes.length).toBe(1);
        parent.appendChild(fragment);
        expect(parent.childNodes.length).toBe(4);
        expect(a.previousSibling).toBeNull()
        expect(a.nextSibling).toBe(fragment);
        expect(fragment.previousSibling).toBe(a);
        expect(fragment.nextSibling).toBe(c);
        expect(c.previousSibling).toBe(fragment);
        expect(c.nextSibling).toBe(d);
        expect(d.previousSibling).toBe(c);
        expect(d.nextSibling).toBe(null);
        expect(parent.childNodes.slice()).toEqual([a, fragment, c, d])
        parent.appendChild(e);
        expect(d.previousSibling).toBe(c);
        expect(d.nextSibling).toBe(e);
        expect(e.previousSibling).toBe(d);
        expect(e.nextSibling).toBe(null);
        expect(parent.childNodes.slice()).toEqual([a, fragment, c, d, e])
        parent.removeChild(fragment);
        expect(parent.childNodes.slice()).toEqual([a, e])
        expect(a.previousElementSibling).toBeNull();
        expect(e.previousElementSibling).toBe(a);
        expect(a.nextElementSibling).toBe(e);
        expect(e.nextElementSibling).toBeNull();
        expect(parent.childNodes.length).toEqual(2);
        parent.insertBefore(fragment, e);
        expect(parent.childNodes.length).toEqual(5);
        expect(a.nextElementSibling).toBe(c);
        expect(c.previousElementSibling).toBe(a);
        expect(e.previousElementSibling).toBe(d)
        fragment.removeChild(d)
        expect(c.previousElementSibling).toBe(a);
        expect(e.previousElementSibling).toBe(c)
        parent.childNodes.splice(1, 1)
        expect(a.previousElementSibling).toBeNull();
        expect(e.previousElementSibling).toBe(a);
        expect(a.nextElementSibling).toBe(e);
        expect(e.nextElementSibling).toBeNull();
        parent.childNodes.splice(1, 0, fragment)
        expect(c.previousElementSibling).toBe(a);
        expect(e.previousElementSibling).toBe(c)
        parent.childNodes.splice(1, 2)
        expect(e.previousElementSibling).toBe(a);
        expect(a.nextElementSibling).toBe(e);
      })
      it ('should be able to remove nodes', function() {
        var parent = new LSD.Element;
        var a = new LSD.Element;
        var b = new LSD.Element;
        var x = new LSD.Element;
        var z = new LSD.Element;
        var f1 = new LSD.Fragment(a, b);
        parent.appendChild(x);
        parent.appendChild(f1);
        parent.appendChild(z);
        f1.removeChild(a);
        expect(x.nextSibling).toBe(f1);
        expect(f1.previousSibling).toBe(x);
        expect(f1.nextSibling).toBe(b);
        expect(b.previousSibling).toBe(f1);
        expect(x.nextElementSibling).toBe(b);
        expect(b.previousElementSibling).toBe(x);
        expect(b.nextElementSibling).toBe(z);
        expect(z.previousElementSibling).toBe(b);
      })
      it ('should be able to replace nodes', function() {
        var parent = new LSD.Element;
        var a = new LSD.Element;
        var b = new LSD.Element;
        var c = new LSD.Element;
        var d = new LSD.Element;
        var e = new LSD.Element;
        var x = new LSD.Element;
        var z = new LSD.Element;
        var f1 = new LSD.Fragment(a, b);
        var f2 = new LSD.Fragment(c, d);
        parent.appendChild(x);
        parent.appendChild(f1);
        parent.appendChild(z);
        expect(x.nextElementSibling).toBe(a);
        expect(a.previousElementSibling).toBe(x);
        expect(b.nextElementSibling).toBe(z);
        expect(z.previousElementSibling).toBe(b);
        f1.replaceChild(e, a)
        expect(f1.childNodes[0]).toBe(e)
        expect(x.nextElementSibling).toBe(e);
        expect(e.previousElementSibling).toBe(x);
        expect(e.nextElementSibling).toBe(b);
        expect(b.previousElementSibling).toBe(e);
        expect(a.nextElementSibling).toBeNull();
        expect(a.previousElementSibling).toBeNull();
      })
    })
  })
})