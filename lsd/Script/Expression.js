describe('LSD.Script.Expression', function() {
  // following are mootools-compatible Event & Chain APIs
  // as different ways to set up callbacks
  var Chain = function() {
    this.items = [];
  }
  Chain.prototype.chain = function(fn){
    this.items.push(fn)
  }
  Chain.prototype.callChain = function(){
    var fn = this.items.shift();
    if (fn) return fn.apply(this, arguments)
  }
  var Events = function() {
    
  };
  Events.prototype.addEvent = function(name, fn) {
    if (!this[name]) this[name] = [];
    this[name].push(fn);
  };
  Events.prototype.addEvents = function(events) {
    for (var event in events) this.addEvent(event, events[event])
  };
  Events.prototype.removeEvents = function(events) {
    for (var event in events) this.removeEvent(event, events[event])
  };
  Events.prototype.removeEvent = function(name, fn) {
    this[name].splice(this[name].indexOf(fn), 1);
  };
  Events.prototype.fireEvent = function(name, args) {
    if (this[name]) this[name].forEach(function(fn) {
      fn.apply(this, args)
    })
  };
  describe('when give multiple comma separated expressions', function() {
    it ('should evaluate expressions sequentially', function() {
      var scope = new LSD.Journal;
      var result
      var callback = function(value) {
        result = value;
      }
      var script = LSD.Script('a, b', scope, callback);
      expect(result).toBeNull();
      expect(scope._watched['a']).toBeTruthy()
      expect(scope._watched['b']).toBeFalsy()
      scope.set('a', 1);
      expect(scope._watched['a']).toBeTruthy()
      expect(scope._watched['b']).toBeTruthy()
      expect(result).toBeNull();
      scope.set('b', 2);
      expect(result).toEqual(2);
      scope.set('a', 3);
      expect(result).toEqual(2);
      scope.unset('b', 2);
      expect(result).toBeNull()
      expect(scope._watched['a']).toBeTruthy()
      expect(scope._watched['b']).toBeTruthy()
      script.set('attached', false);
      //expect(scope._watched['a']).toEqual([])
      //expect(scope._watched['b']).toEqual([])
    });
    
    it ('should evaluate function calls sequentially', function() {
      var scope = new LSD.Journal;
      var result, state
      var callback = function(value) {
        result = value;
      }
      scope.set('submit', function(value) {
        state = 'submitted'
        return value;
      });
      scope.set('update', function(value) {
        state = 'updated'
        return value;
      });
      var script = LSD.Script('submit(a), update(b), update(c || 1)', scope, callback);
      expect(scope._watched['a']).toBeTruthy()
      expect(scope._watched['b']).toBeFalsy()
      scope.set('a', 1);
      expect(state).toBe('submitted')
      expect(scope._watched['a']).toBeTruthy()
      expect(scope._watched['b']).toBeTruthy()
      scope.set('b', 1);
      expect(state).toBe('updated')
      expect(result).toBe(1)
      scope.set('c', 4);
      expect(result).toBe(4)
      scope.set('a', null);
      expect(scope._watched['a']).toBeTruthy()
      //expect(scope._watched['b']).toBeFalsy()
    });
    
    it ("should lazily evaluate expressions with deep variables", function() {
      var scope = new LSD.Journal;
      var script = LSD.Script('time_range.starts_at && time_range.recurrence_rule.interval || 1', scope)
      expect(script.value).toEqual(1);
      scope.set('time_range.recurrence_rule.interval', 2);
      expect(script.value).toEqual(1);
      scope.set('time_range.starts_at', 3);
      expect(script.value).toEqual(2);
      scope.set('time_range.starts_at', 0);
      expect(script.value).toEqual(1);
    })
    
    it ("should lazily evaluate expression with deep variables and falsy fallbacks", function() {
      var scope = new LSD.Journal;
      var script = LSD.Script('time_range.starts_at && time_range.recurrence_rule.interval || ""', scope)
      expect(script.value).toEqual("");
      scope.set('time_range.recurrence_rule.interval', 2);
      expect(script.value).toEqual("");
      scope.set('time_range.starts_at', 3);
      expect(script.value).toEqual(2);
      scope.set('time_range.starts_at', 0);
      expect(script.value).toEqual("");
    });
    
    it ("should be able to wait for asynchronous results returned from function calls", function() {
      var scope = new LSD.Journal;
      var read = new Chain;
      var write = new Chain;
      scope.set('read', function() {
        return read;
      });
      scope.set('transform', function(content) {
        return '[' + content + ']';
      });
      scope.set('write', function(content) {
        write.content = content
        return write;
      });
      scope.set('notify', function(content) {
        return 'Superb ' + content;
      });
      var script = LSD.Script('read(), transform(), write(), notify()', scope);
      expect(script.value).toBeUndefined()
      expect(script.args[0].value).toEqual(read);
      expect(script.args[1].variable).toBeUndefined();
      read.callChain('nurga');
      expect(script.value).toBeUndefined()
      expect(script.args[1].value).toEqual('[nurga]');
      expect(script.args[2].value).toEqual(write);
      write.callChain(write.content);
      expect(script.value).toEqual('Superb [nurga]');
    });
    
    it ("should be able to handle failures and execute alternative actions", function() {
      var scope = new LSD.Journal;
      var invent = new Events;
      invent.onFailure = function(){ 
        return invent.fireEvent('failure', arguments); 
      };
      invent.onSuccess = function(){ 
        return invent.fireEvent('success', arguments); 
      };
      scope.set('invent', function(content) {
        return invent;
      });
      scope.set('steal', function(reason) {
        return 'Stole invention because ' + reason;
      });
      scope.set('unsteal', function(reason) {
        return '';
      });
      scope.set('profit', function(biz) {
        return '$$$ ' + biz
      });
      var script = $script = LSD.Script('invent() || steal(), profit()', scope);
      expect(script.value).toBeNull()
      invent.onFailure('I was drunk')
      expect(script.value).toEqual('$$$ Stole invention because I was drunk');
      script.prepiped = 1;
      script.execute(true)
      expect(script.value).toBeNull()
      invent.onSuccess('Fair invention')
      expect(script.value).toEqual('$$$ Fair invention');
      script.prepiped = 2;
      script.execute(true);
      expect(script.value).toBeNull()
      invent.onFailure('Dog ate my homework')
      expect(script.value).toEqual('$$$ Stole invention because Dog ate my homework');
    });
    
    it ("should be able to handle failures and execute alternative actions in methods without parentheses", function() {
      var scope = new LSD.Journal({methods: {}});
      var invent = new Events;
      invent.onFailure = function(){ 
        return invent.fireEvent('failure', arguments); 
      };
      invent.onSuccess = function(){ 
        return invent.fireEvent('success', arguments); 
      };
      scope.methods.set('invent', function(content) {
        return invent;
      });
      scope.methods.set('steal', function(reason) {
        return 'Stole invention because ' + reason;
      });
      scope.methods.set('unsteal', function(reason) {
        return '';
      });
      scope.methods.set('profit', function(biz) {
        return '$$$ ' + biz
      });
      var script = $script = LSD.Script('invent || steal, profit', scope);
      expect(script.value).toBeNull()
      invent.onFailure('I was drunk')
      expect(script.value).toEqual('$$$ Stole invention because I was drunk');
      script.prepiped = 1;
      script.execute(true)
      expect(script.value).toBeNull()
      invent.onSuccess('Fair invention')
      expect(script.value).toEqual('$$$ Fair invention');
      script.prepiped = 2;
      script.execute(true)
      expect(script.value).toBeNull()
      invent.onFailure('Dog ate my homework')
      expect(script.value).toEqual('$$$ Stole invention because Dog ate my homework');
    });
    
    it ("should be able to stack multiple scripts together (kind of coroutines and aspects)", function() {
      var scope = new LSD.Journal;
      var submit = new Events;
      submit.onFailure = function(){ 
        return submit.fireEvent('failure', arguments); 
      };
      submit.onSuccess = function(){ 
        return submit.fireEvent('success', arguments); 
      };
      scope.merge({
        submit: function(data) {
          submit.data = data;
          return submit;
        },
        before: function() {
          return "Hi"
        },
        after: function(data) {
          return data + "... Boom"
        }
      });
      var script = LSD.Script('submit()');
      script.scope = scope;
      var advice = LSD.Script('before(), yield(), after()');
      script.set('wrapper', advice);
      expect(script.value).toBeUndefined()
      advice.scope = scope;
      advice.set('attached', true);
      expect(script.value).toEqual(submit)
      expect(advice.value).toBeUndefined()
      expect(advice.args[0].script).toBeTruthy();
      expect(advice.args[1].script).toBeTruthy();
      expect(advice.args[1].value).toEqual(submit);
      expect(advice.args[2].script).toBeUndefined();
      submit.onSuccess(submit.data + 'Jack');
      expect(advice.value).toEqual('HiJack... Boom')
    })
    
    it ("should be able to stack multiple scripts together and make one handle failures in another", function() {
      var scope = new LSD.Journal;
      var submit = new Events;
      submit.onFailure = function(){ 
        return submit.fireEvent('failure', arguments); 
      };
      submit.onSuccess = function(){ 
        return submit.fireEvent('success', arguments); 
      };
      var errors = 0;
      scope.merge({
        submit: function(data) {
          submit.data = data;
          return submit;
        },
        error: function(data) {
          errors++;
          return "Error: " + data
        },
        unerror: function() {
          errors--;
        },
        before: function(data) {
          return (data || '') + "Hi"
        },
        after: function(data) {
          return data + "... Boom"
        }
      });
      var script = LSD.Script('submit()');
      var advice = LSD.Script('before(), yield() || error(), after()');
      script.scope = advice.scope = scope;
      script.set('wrapper', advice);
      expect(script.value).toBeUndefined()
      expect(script.args[0]).toBeUndefined()
      expect(advice.args[0].script).toBeUndefined()
      advice.set('attached', true);
      expect(script.value).toEqual(submit)
      expect(advice.value).toBeNull()
      expect(advice.args[0].script).toBeTruthy();
      expect(advice.args[1].script).toBeTruthy();
      expect(advice.args[1].args[0].value).toEqual(submit);
      expect(advice.args[1].value).toBeUndefined();
      expect(advice.args[2].script).toBeUndefined();
      submit.onFailure(submit.data + 'Jack');
      expect(advice.value).toEqual('Error: HiJack... Boom');
      expect(errors).toEqual(1);
      advice.piped = advice.prepiped = 'Oh! ';
      script.execute(true)
      expect(advice.value).toBeNull()
      submit.onSuccess(submit.data + 'Jackie');
      expect(advice.value).toEqual('Oh! HiJackie... Boom');
      expect(errors).toEqual(0);
    })
    
    it ("should be able to stack multiple scripts together and make one handle failures in another with parenthesis-free syntax", function() {
      var scope = new LSD.Journal({methods: {}});
      var submit = new Events;
      submit.onFailure = function(){ 
        return submit.fireEvent('failure', arguments); 
      };
      submit.onSuccess = function(){ 
        return submit.fireEvent('success', arguments); 
      };
      var errors = 0;
      scope.methods.merge({
        submit: function(data) {
          submit.data = data;
          return submit;
        },
        error: function(data) {
          errors++;
          return "Error: " + data
        },
        unerror: function() {
          errors--;
        },
        before: function(data) {
          return (data || '') + "Hi"
        },
        after: function(data) {
          return data + "... Boom"
        }
      });
      var script = LSD.Script('submit');
      var advice = LSD.Script('before, yield || error, after');
      script.scope = advice.scope = scope;
      script.set('wrapper', advice);
      expect(script.value).toBeUndefined()
      expect(advice.args[0].script).toBeUndefined()
      advice.set('attached', true);
      expect(script.value).toEqual(submit)
      expect(advice.value).toBeNull()
      expect(advice.args[0].script).toBeTruthy();
      expect(advice.args[1].script).toBeTruthy();
      expect(advice.args[1].args[0].value).toEqual(submit);
      expect(advice.args[1].value).toBeUndefined();
      expect(advice.args[2].script).toBeUndefined();
      submit.onFailure(submit.data + 'Jack');
      expect(advice.value).toEqual('Error: HiJack... Boom');
      expect(errors).toEqual(1);
      advice.piped = advice.prepiped = 'Oh! ';
      advice.execute(true)
      expect(advice.value).toBeNull()
      submit.onSuccess(submit.data + 'Jackie');
      expect(advice.value).toEqual('Oh! HiJackie... Boom');
    })
  })
})