describe("LSD.Properties.Attributes", function() {
  
  it ("should manage attributes", function() {
    var instance = new LSD.Element({tag: 'div'});
    instance.build();
    instance.setAttribute("disabled", true);
    expect(instance.element["disabled"]).toBeTruthy();
    expect(instance.attributes["disabled"]).toBeTruthy();
    instance.removeAttribute("disabled");
    expect(instance.element["disabled"]).toBeFalsy();
    expect(instance.attributes["disabled"]).toBeFalsy();
  });

  it ("should manage pseudos via attributes", function() {
    var instance = new LSD.Element({tag: 'div'});
    instance.setAttribute("empty", true);
    expect(instance["empty"]).toBeTruthy();
    expect(instance.attributes["empty"]).toBeTruthy();
    instance.build();
    expect(instance.element["empty"]).toBeTruthy();
    instance.removeAttribute("empty");
    expect(instance["empty"]).toBeFalsy();
    expect(instance.attributes["empty"]).toBeFalsy();
    expect(instance.element["empty"]).toBeFalsy();
  });



  it ("should manage attributes & pseudos via states", function() {
    var instance = new LSD.Element;
    instance.set("checked", true);
    expect(instance["checked"]).toBeTruthy();
    expect(instance.attributes["checked"]).toBeTruthy();
    instance.unset("checked", true);
    expect(instance["checked"]).toBeFalsy();
    expect(instance.attributes["checked"]).toBeFalsy();
  });

  it ("should set state when state was already defined and class with the name of the state was added", function() {
    var element = document.createElement('div');
    var instance = new LSD.Element(element);
    instance.set('selected');
    instance.classList.add('selected');
    expect(instance.selected).toBeTruthy();
  });

  it ("should set state when class with the name of the state was added and state was already defined", function() {
    var element = document.createElement('div');
    var instance = new LSD.Element(element);
    instance.classList.add('selected');
    instance.set('selected', true); //FIXME
    expect(instance.selected).toBeTruthy();
  });
  
  it ("should be able to set state through a class without state defined", function() {
    var element = document.createElement('div');
    var instance = new LSD.Element(element);
    instance.classList.add('selected');
    expect(instance.selected).toBeTruthy();
  });
  
  it ("should be able to pick up the state from element", function() {
    var element = document.createElement('div');
    element.setAttribute('checked', 'checked');
    var instance = new LSD.Element(element);
    expect(instance.checked).toBeTruthy();
    expect(instance.checked).toBeTruthy();
    expect(instance.attributes.checked).toBeTruthy();
    instance.removeAttribute('checked');
    expect(instance.checked).toBeFalsy();
    expect(instance.checked).toBeFalsy();
    expect(instance.attributes.checked).toBeFalsy();
  })
  
  it ("should remove the state after the attribute that gave it is removed", function() {
    var element = document.createElement('div');
    element.setAttribute('checked', 'checked');
    var instance = new LSD.Element(element);
    expect(instance.checked).toBeTruthy();
    instance.uncheck();
    expect(instance.checked).toBeFalsy();
    expect(instance.checked).toBeFalsy();
    expect(instance.attributes.checked).toBeFalsy();
    instance.setAttribute('checked', true);
    expect(instance.checked).toBeTruthy();
    expect(instance.checked).toBeTruthy();
    expect(instance.attributes.checked).toBeTruthy();
    instance.uncheck();
    expect(instance.checked).toBeFalsy();
    expect(instance.checked).toBeFalsy();
    expect(instance.attributes.checked).toBeFalsy();
  })
  
  it ("should not remove the state from widget, if the state was given by an attribute AND explicitly", function() {
    var element = document.createElement('div');
    element.setAttribute('checked', 'checked');
    var instance = new LSD.Element({checked: false});
    instance.set('origin', element);
    expect(instance.checked).toBeTruthy();
    instance.uncheck();
    expect(instance.checked).toBeFalsy();
    expect(instance.checked).toBeFalsy();
    expect(instance.attributes.checked).toBeFalsy();
    expect(instance.check).toBeTruthy();
  })
  
  it ("should get the explicit state set to null, acquire methods but not trigger state change", function() {
    var instance = new LSD.Element;
    expect(instance.checked).toBeFalsy()
    expect(instance.check).toBeFalsy()
    instance.set('checked', null);
    expect(instance.check).toBeTruthy()
    expect(instance.checked).toBeFalsy()
    instance.unset('checked', null);
    expect(instance.checked).toBeFalsy()
    expect(instance.check).toBeFalsy()
  });
  
  it ("should be able to watch other state", function() {
    var instance = new LSD.Element;
    instance.watch('checked', 'selected');
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeFalsy();
    expect(instance.select).toBeFalsy();
    instance.set('checked', true);
    expect(instance.checked).toBeTruthy();
    expect(instance.selected).toBeTruthy();
    expect(instance.check).toBeTruthy();
    expect(instance.select).toBeTruthy();
    instance.unset('checked', true);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeFalsy();
    expect(instance.select).toBeFalsy();
  });
  
  it ("should be able to watch other state and proxy nulls", function() {
    var instance = new LSD.Element;
    instance.watch('checked', 'selected');
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeFalsy();
    expect(instance.select).toBeFalsy();
    instance.set('checked', null);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeTruthy();
    expect(instance.select).toBeTruthy();
    instance.unset('checked', null);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeFalsy();
    expect(instance.select).toBeFalsy();
  })
  
  it ("should allow circular watch", function() {
    var instance = new LSD.Element;
    instance.watch('checked', 'selected');
    instance.watch('selected', 'checked');
    instance.set('checked', null);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeTruthy();
    expect(instance.select).toBeTruthy();
    instance.unset('selected', null);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeFalsy();
    expect(instance.select).toBeFalsy();
    instance.set('checked', true);
    expect(instance.checked).toBeTruthy();
    expect(instance.selected).toBeTruthy();
    expect(instance.check).toBeTruthy();
    expect(instance.select).toBeTruthy();
    instance.set('checked', false);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeTruthy();
    expect(instance.select).toBeTruthy();
    instance.unset('checked', false);
    expect(instance.checked).toBeTruthy();
    expect(instance.selected).toBeTruthy();
    expect(instance.check).toBeTruthy();
    expect(instance.select).toBeTruthy();
    instance.unset('checked', true);
    expect(instance.checked).toBeFalsy();
    expect(instance.selected).toBeFalsy();
    expect(instance.check).toBeFalsy();
    expect(instance.select).toBeFalsy();
    expect(instance._journal.checked.length).toEqual(0);
    expect(instance._journal.selected).toBeUndefined()
  })
  
  it ("should make attributes type='checkbox' and checked='checked'", function() {
    var element = document.createElement('input');
    element.type = 'checkbox';
    element.setAttribute('checked', 'checked');
    var instance = new LSD.Element(element);
    expect(instance.tagName).toEqual('input');
    instance.build()
    
    expect(instance.attributes.type).toEqual('checkbox');
    expect(instance.getAttribute('type')).toEqual('checkbox');
    expect(instance.element.getAttribute('type')).toEqual('checkbox');
    
    expect(instance.checked).toBeTruthy();
    expect(instance.attributes.checked).toBeTruthy();
    expect(instance.getAttribute('checked')).toBeTruthy();
    expect(instance.element.getAttribute('checked')).toBeTruthy();
  })
});

describe("LSD.Properties.Classes", function() {
  it ("should manage states", function() {
    var instance = new LSD.Element;
    instance.set("empty", true);
    expect(instance.classList["empty"]).toBeTruthy();
    instance.unset("empty", true);
    expect(instance.classList["empty"]).toBeFalsy();
  });  

  it ("should manage classList", function() {
    var instance = new LSD.Element;
    instance.classList.add("first");
    instance.classList.add("second");
    expect(instance.hasClass("first")).toBeTruthy();
    expect(instance.hasClass("second")).toBeTruthy();
    instance.classList.remove("first");
    expect(instance.hasClass("first")).toBeFalsy();
    expect(instance.hasClass("second")).toBeTruthy();
  });
})
