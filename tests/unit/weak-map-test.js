import Ember from 'ember';
import { module, test } from 'qunit';

module('Ember.WeakMap');

test('has weakMap like qualities', assert => {
  assert.expect(32);

  const map = new Ember.WeakMap();
  const map2 = new Ember.WeakMap();

  const a = {};
  const b = {};
  const c = {};
  const d = () => {};
  const e = [];

  assert.equal(map.get(a), undefined);
  assert.equal(map.get(b), undefined);
  assert.equal(map.get(c), undefined);

  assert.equal(map2.get(a), undefined);
  assert.equal(map2.get(b), undefined);
  assert.equal(map2.get(c), undefined);

  assert.equal(map.set(a,  1), map, 'map.set should return itself');
  assert.equal(map.get(a), 1);
  assert.equal(map.set(b,  undefined), map);
  assert.equal(map.set(a, 2), map);
  assert.equal(map.get(a), 2);
  assert.equal(map.set(b,  undefined), map);

  assert.equal(map2.get(a), undefined);
  assert.equal(map2.get(b), undefined);
  assert.equal(map2.get(c), undefined);

  assert.equal(map.set(c, 1), map);
  assert.equal(map.get(c), 1);
  assert.equal(map.get(a), 2);
  assert.equal(map.get(b), undefined);

  assert.equal(map2.set(a, 3), map2);
  assert.equal(map2.set(b, 4), map2);
  assert.equal(map2.set(c, 5), map2);
  assert.equal(map2.set(d, 6), map2);
  assert.equal(map2.set(e, 7), map2);

  assert.equal(map2.get(a), 3);
  assert.equal(map2.get(b), 4);
  assert.equal(map2.get(c), 5);
  assert.equal(map2.get(d), 6);
  assert.equal(map2.get(e), 7);

  assert.equal(map.get(c), 1);
  assert.equal(map.get(a), 2);
  assert.equal(map.get(b), undefined);
});

test('that error is thrown when using a primitive key', assert => {
  assert.expect(5);

  const map = new Ember.WeakMap();

  assert.throws(() => map.set('a', 1), new TypeError('Invalid value used as weak map key'));
  assert.throws(() => map.set(1, 1), new TypeError('Invalid value used as weak map key'));
  assert.throws(() => map.set(true, 1), new TypeError('Invalid value used as weak map key'));
  assert.throws(() => map.set(null, 1), new TypeError('Invalid value used as weak map key'));
  assert.throws(() => map.set(undefined, 1), new TypeError('Invalid value used as weak map key'));
});

test('that .has and .delete work as expected', assert => {
  assert.expect(8);

  const map = new Ember.WeakMap();
  const a = {};
  const b = {};
  const foo = { id: 1, name: 'My file', progress: 0 };

  assert.deepEqual(map.set(a, foo), map);
  assert.deepEqual(map.get(a), foo);
  assert.ok(map.has(a));
  assert.ok(!map.has(b));

  assert.ok(map.delete(a));
  assert.ok(!map.delete(a));

  assert.ok(!map.has(a));

  map.set(a, undefined);
  assert.ok(map.has(a));
});

test('that passing an array to the constructor works', assert => {
  assert.expect(5);

  const a = {};
  const b = {};
  const c = {};
  const d = {};
  const e = () => {};
  const map = new Ember.WeakMap([[a, 'a'], [b, 'b'], [c, 'c', 'foo'], [d], [e]]);

  assert.deepEqual(map.get(a), 'a');
  assert.deepEqual(map.get(b), 'b');
  assert.deepEqual(map.get(c), 'c');
  assert.deepEqual(map.get(d), undefined);
  assert.deepEqual(map.get(e), undefined);
});

test('that passing a non iterable to the constructor throws correct error', assert => {
  assert.expect(2);

  /*
   Embers internal weakmap has this type check so we test that the polyfill does as well.
   https://github.com/emberjs/ember.js/blob/0b190028c0fa0840175a1cd3dc2d2d9e4cadc275/packages/ember-metal/lib/weak_map.js#L40
  */
  assert.throws(() => new Ember.WeakMap('string'), new TypeError('The weak map constructor polyfill only supports an array argument'));
  assert.throws(() => new Ember.WeakMap(() => {}), new TypeError('The weak map constructor polyfill only supports an array argument'));
});

test('that passing an array to the constructor with non object keys fails', assert => {
  assert.expect(2);

  const a = {};
  const badKey = 'bad-key';

  assert.throws(() => new Ember.WeakMap([[a, 'a'], [badKey, 'foo']]), new TypeError('Invalid value used as weak map key'));
  assert.throws(() => new Ember.WeakMap([[]]), new TypeError('Invalid value used as weak map key'));
});
