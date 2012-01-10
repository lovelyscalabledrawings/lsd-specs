describe("LSD.Struct", function() {
  describe("when initialized with set of properties", function() {
    describe("and the property is callback", function() {
      it ("should call the callback when the observed value is changed", function() {
        var title;
        var Struct = LSD.Struct({
          title: function(value) {
            title = value
          }
        });
        var instance = new Struct({title: 'Lord'})
        expect(title).toEqual('Lord')
        instance.unset('title', 'Lord');
        expect(title).toBeUndefined();
      });
      it ("should mutate the value if callback returns the value", function() {
        var Struct = LSD.Struct({
          title: function(value) {
            return value + 123
          }
        });
        var instance = new Struct({title: 'Lord'})
        expect(instance.title).toEqual('Lord123')
        instance.unset('title', 'Lord123');
        expect(instance.title).toBeUndefined();
      })
    });
    describe("and the property is a data structure", function() {
      it ("should construct that object on demand", function() {
        var Person = LSD.Struct({
          title: function(value) {
            return value + 123
          }
        });
        var Struct = LSD.Struct({
          person: Person
        });
        var instance = new Struct({person: {title: 'Lord'}});
        expect(instance.person instanceof Person).toBeTruthy()
        expect(instance.person.title).toEqual('Lord123')
        instance.person.unset('title', 'Lord123');
        expect(instance.person.title).toBeUndefined();
      })
    });
    describe("and the property is string", function() {
      describe("and that string is a simple alias of the value within the same object", function() {
        it ("should redirect calls to the alias object", function() {
          var Person = LSD.Struct({
            title: function(value) {
              return value + 123
            }
          });
          var Struct = LSD.Struct({
            person: Person,
            author: 'person'
          });
          var instance = new Struct({author: {title: 'Lord'}});
          expect(instance.person instanceof Person).toBeTruthy()
          expect(instance.person).toEqual(instance.author)
          expect(instance.person.title).toEqual('Lord123')
          expect(instance.author.title).toEqual('Lord123')
          var person = new Person({name: 'Jackie'});
          instance.set('person', person);
          expect(instance.person).toEqual(person);
          expect(instance.author).toEqual(person);
          expect(instance.person.title).toEqual('Lord123')
          expect(instance.author.title).toEqual('Lord123')
          expect(instance.person.name).toEqual('Jackie')
          expect(instance.author.name).toEqual('Jackie')
        })
      });
      describe("and that string is a nested dot-separated property", function() {
        it ("should assign nested parameters and initialize all objects on its path", function() {
          var Person = LSD.Struct({
            title: function(value) {
              return value + 123
            }
          });
          var Post = LSD.Struct({
            person: Person,
            author: 'person'
          });
          var Struct = LSD.Struct({
            post: Post,
            author: 'post.person'
          });
          var instance = new Struct({author: {title: 'Lord'}});
          expect(instance.author instanceof Person).toBeTruthy()
          expect(instance.post.person).toEqual(instance.author)
          expect(instance.post.person.title).toEqual('Lord123')
          expect(instance.author.title).toEqual('Lord123')
          instance.post.person.unset('title', 'Lord123');
          expect(instance.post.person.title).toBeUndefined();
          expect(instance.author.title).toBeUndefined();
        })
      })
      describe("and that string is a nested dot-separated property that starts with dot", function() {
        it ("should find the holder first and then assign nested parameters and initialize all objects on its path", function() {
          var Person = LSD.Struct({
            title: function(value) {
              return value + 123
            }
          });
          var Struct = LSD.Struct({
            post: LSD.Struct({
              author: '.person'
            }),
            person: Person
          });
          var instance = new Struct({post: {author: {title: 'Lord'}}});
          expect(instance.person instanceof Person).toBeTruthy()
          expect(instance.post.author).toEqual(instance.person)
          expect(instance.post.author.title).toEqual('Lord123')
          expect(instance.person.title).toEqual('Lord123')
          instance.post.author.unset('title', 'Lord123');
          expect(instance.post.author.title).toBeUndefined();
          expect(instance.person.title).toBeUndefined();
        })
        
        it ("should be able to-reapply proxied values when linked object changes", function() {
          var Person = LSD.Struct.Stack({
            title: function(value) {
              return value + 123
            }
          });
          var Animal = LSD.Struct.Stack({
            title: function(value) {
              return value + 321
            }
          });
          var Post = LSD.Struct({
            author: '.person'
          });
          var Struct = LSD.Struct.Stack({
            post: Post,
            person: Person
          });
          var data = {post: {author: {title: 'Lord'}}};
          var instance = new Struct(data);
          expect(instance.person.title).toEqual('Lord123')
          var person = instance.person;
          var animal = new Animal;
          instance.set('person', animal)
          expect(instance.person).toNotEqual(person)
          expect(instance.person instanceof Animal).toBeTruthy()
          expect(instance.person.title).toEqual('Lord321');
          expect(person.title).toBeUndefined();
          var post = instance.post;
          instance.unset('post', post)
          expect(post.author).toBeUndefined()
          expect(post.title).toBeUndefined()
          expect(post._parent).toBeUndefined()
          expect(instance.person.title)
          expect(instance.person).toEqual(animal)
          var announcement = new Post
          instance.set('post', announcement)
          expect(announcement.author).toEqual(instance.person)
          expect(instance.person.title).toEqual('Lord321');
          instance.mix(data, null, null, false)
          expect(instance.person.title).toBeUndefined()
          instance.set('person', new Person)
          expect(instance.person.title).toBeUndefined()
          instance.set('post', new Post)
          expect(instance.person.title).toBeUndefined();
          instance.mix('post', {author: {title: 'Sir'}})
          expect(instance.person.title).toEqual('Sir123')
          instance.set('person', animal);
          // up to this point, person was set 4 times: 1 implicitly & 3 explicitly
          expect(instance.person.title).toEqual('Sir321')
          instance.unset('person', animal)
          expect(instance.person.title).toEqual('Sir123')
          instance.unset('person', instance.person)
          expect(instance.person.title).toEqual('Sir321')
          instance.unset('person', instance.person)
          expect(instance.person.title).toEqual('Sir123')
          instance.unset('person', instance.person)
          expect(instance.person).toBeUndefined()
          expect(instance.post.author).toBeUndefined()
        })
      });
      
      describe("and data is given asynchronously", function() {
        it ("should apply the data when the watched property match", function() {
          var Person = LSD.Struct.Stack({
            name: function(name) {
              return name + 123;
            }
          })
          var Post = LSD.Struct.Stack({
            author: '.person'
          });
          var Struct = LSD.Struct.Stack({
            post: Post,
            person: Person
          });
          var post = new Post({author: {name: "George"}});
          var struct = new Struct
          struct.set('post', post);
          var george = struct.person;
          expect(struct.person instanceof Person).toBeTruthy()
          expect(struct.person).toEqual(post.author);
          expect(struct.person.name).toEqual("George123");
          struct.unset('post', post);
          expect(post.author).toBeUndefined()
          expect(struct.person instanceof Person).toBeTruthy()
          expect(struct.person.name).toBeUndefined()
          var hollie = new Person({name: 'Hollie'})
          expect(hollie.name).toEqual("Hollie123");
          struct.set('person', hollie);
          expect(struct.person).toEqual(hollie)
          expect(struct.person.name).toEqual("Hollie123");
        })
      });
      
      describe("and a link is linked to another link", function() {
        it ("it should resolve deep links", function() {
            var Person = LSD.Struct.Stack({
              name: function(name) {
                return name + 123;
              }
            })
            var Post = LSD.Struct.Stack({
              author: '.topic.person',
              person: '.person'
            });
            var Struct = LSD.Struct.Stack({
              post: Post,
              topic: 'post',
              person: Person
            });
            var post = new Post({author: {name: "George"}});
            var struct = new Struct
            struct.set('post', post);
            var george = struct.person;
            expect(struct.person instanceof Person).toBeTruthy()
            expect(struct.person).toEqual(post.author);
            expect(post.person).toEqual(post.author);
            expect(struct.post).toEqual(struct.topic);
            expect(struct.person.name).toEqual("George123");
            struct.unset('post', post);
            expect(post.author).toBeUndefined()
            expect(struct.person instanceof Person).toBeTruthy()
            expect(struct.person.name).toBeUndefined()
            var hollie = new Person({name: 'Hollie'})
            expect(hollie.name).toEqual("Hollie123");
            struct.set('person', hollie);
            expect(struct.person).toEqual(hollie)
            expect(struct.person.name).toEqual("Hollie123");
        })
      })
      
      
      describe("and a struct has _delegate method defined", function() {
        it ("should call that method whenever setting linked object properties", function() {
          var Events = LSD.Struct.Group({
            'matches': '.matches'
          });
          Events.implement({
            _delegate: function(object, name, value, state, memo) {
              if (this._properties[name]) return;
              object.mix('events', value, memo, state)
              return true;
            }
          })
          var Matches = LSD.Struct.Group({});
          Matches.implement({
            _construct: function() {
              return null;
            }
          })
          var Widget = LSD.Struct({
            events:   Events,
            matches:  Matches
          });
          var widget = new Widget({
            events: {
              matches: {
                'button + bar': {
                  click: function() {}
                }
              }
            }
          });
          var found = new Widget;
          widget.matches.set('button + bar', found);
          expect(widget.events.click).toBeUndefined();
          expect(found.events.click).toBeTruthy();
          widget.matches.unset('button + bar', found);
          expect(found.events.click).toEqual([]);
        })
        
        it ("should use that method to take back the control after a chain through other modules", function() {
          var Matches = LSD.Struct.Group({});
          Matches.implement({
            _construct: function() {
              return null;
            }
          })
          var Relations = LSD.Struct.Group({});
          Relations.implement({
            _construct: function() {
              return null;
            }
          })
          var Events = LSD.Struct.Group({
            'matches': '.matches',
            'relations': '.relations'
          });
          Events.implement({
            _delegate: function(object, name, value, state, memo) {
              if (this._properties[name]) return;
              object.mix('events', value, memo, state)
              return true;
            }
          })
          var Widget = LSD.Struct({
            events:    Events,
            matches:   Matches,
            relations: Relations
          })
          var click = function() {};
          var widget = new Widget({
            events: {
              relations: {
                grid: {
                  matches: {
                    'button + bar': {
                      click: click
                    }
                  }
                }
              }
            }
          });
          var found = new Widget;
          expect(found.events).toBeFalsy();
          expect(widget.matches).toBeFalsy();
          var grid = new Widget
          widget.relations.set('grid', grid)
          expect(grid.matches).toBeTruthy();
          expect(found.events).toBeFalsy();
          grid.matches.set('button + bar', found);
          expect(widget.events.click).toBeUndefined();
          expect(found.events.click).toEqual([click]);
          grid.matches.unset('button + bar', found);
          expect(found.events.click).toEqual([]);
          grid.matches.set('button + bar', found);
          expect(found.events.click).toEqual([click])
          widget.relations.unset('grid', grid)
          expect(found.events.click).toEqual([]);
          widget.relations.set('grid', grid)
          expect(found.events.click).toEqual([click])
          widget.relations.unset('grid', grid)
          expect(found.events.click).toEqual([]);
          grid.matches.unset('button + bar', found);
          expect(found.events.click).toEqual([]);
          widget.relations.set('grid', grid)
          expect(found.events.click).toEqual([]);
          grid.matches.set('button + bar', found);
          expect(found.events.click).toEqual([click])
          widget.relations.unset('grid', grid)
          expect(found.events.click).toEqual([]);
          widget.relations.set('grid', grid)
          expect(found.events.click).toEqual([click])
        })
      })
    });
  })
})