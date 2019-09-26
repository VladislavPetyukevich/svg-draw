function svgObjectTests(object, assert) {
  assert.deepEqual(object.getPosition(), { x: 20, y: 40 }, 'Correctly position at initialization');
  assert.deepEqual(object.getSize(), { width: 80, height: 20 }, 'Correctly size at initialization');

  object.translate(10, 20);
  assert.deepEqual(object.getPosition(), { x: 30, y: 60 }, 'Correctly translates position');

  object.scale(2, 2);
  assert.deepEqual(object.getSize(), { width: 160, height: 40 }, 'Correctly scales size');

  object.setPosition(40, 80);
  assert.deepEqual(object.getPosition(), { x: 40, y: 80 }, 'Correctly changes position');
  object.setSize(100, 40);
  assert.deepEqual(object.getSize(), { width: 100, height: 40 }, 'Correctly changes size');

  object.rotateTransform(-270);
  assert.deepEqual(object.getPosition(), { x: 40, y: 80 }, 'Correct position after rotate by -270 degrees');
  object.rotateTransform(-180);
  assert.deepEqual(object.getPosition(), { x: 40, y: 80 }, 'Correct position after rotate by -180 degrees');
  object.rotateTransform(-90);
  assert.deepEqual(object.getPosition(), { x: 40, y: 80 }, 'Correct position after rotate by -90 degrees');
}

QUnit.test("Rect transformations", function (assert) {
  const rect = SvgEditor.default.rect({ x: 20, y: 40, width: 80, height: 20, fill: '#0000FF' });
  svgObjectTests(rect, assert);
});

QUnit.test("Ellipse transformations", function (assert) {
  const ellipse = SvgEditor.default.ellipse({ x: 20, y: 40, width: 80, height: 20, fill: '#0000FF' });
  svgObjectTests(ellipse, assert);
});

QUnit.test("Triangle path transformations", function (assert) {
  const path = SvgEditor.default.path({ x: 20, y: 40, width: 80, height: 20, d: 'M0,40 L20,0 L40,40 Z', fill: '#0000FF' });
  svgObjectTests(path, assert);
});

QUnit.test("Text transformations", function (assert) {
  const text = SvgEditor.default.path({ x: 20, y: 40, width: 80, height: 20, d: 'M0,40 L20,0 L40,40 Z', fill: '#0000FF' });
  svgObjectTests(text, assert);
});
