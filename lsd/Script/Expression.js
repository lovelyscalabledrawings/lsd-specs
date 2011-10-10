describe('LSD.Script.Expression', function() {
  describe('when give multiple comma separated expressions', function() {
    it ('should evaluate expressions sequentially', function() {
      var scope = new LSD.Script.Scope;
      var result
      var callback = function(value) {
        result = value;
      }
      var script = LSD.Script('a, b', scope, callback);
      expect(result).toBeUndefined();
      expect(scope.variables._watched['a']).toBeTruthy()
      expect(scope.variables._watched['b']).toBeFalsy()
      scope.variables.set('a', 1);
      expect(scope.variables._watched['a']).toBeTruthy()
      expect(scope.variables._watched['b']).toBeTruthy()
      expect(result).toBeNull();
      scope.variables.set('b', 2);
      expect(result).toEqual(2);
      scope.variables.set('a', 3);
      expect(result).toEqual(2);
      scope.variables.unset('b', 2);
      expect(result).toBeNull()
      expect(scope.variables._watched['a']).toBeTruthy()
      expect(scope.variables._watched['b']).toBeTruthy()
      script.detach();
      //expect(scope.variables._watched['a']).toEqual([])
      //expect(scope.variables._watched['b']).toEqual([])
    });
    
    it ('should evaluate function calls sequentially', function() {
      var scope = new LSD.Script.Scope;
      var result, state
      var callback = function(value) {
        result = value;
      }
      scope.methods.set('submit', function(value) {
        state = 'submitted'
        return value;
      });
      scope.methods.set('update', function(value) {
        state = 'updated'
        return value;
      });
      var script = LSD.Script('submit(a), update(b), update(c || 1)', scope, callback);
      expect(scope.variables._watched['a']).toBeTruthy()
      expect(scope.variables._watched['b']).toBeFalsy()
      scope.variables.set('a', 1);
      expect(state).toBe('submitted')
      expect(scope.variables._watched['a']).toBeTruthy()
      expect(scope.variables._watched['b']).toBeTruthy()
      scope.variables.set('b', 1);
      expect(state).toBe('updated')
      expect(result).toBe(1)
      scope.variables.set('c', 4);
      expect(result).toBe(4)
    })
  })
})