const iterMapper = mapperFn => function* mapIter(iterable) {
  for (const entry of iterable) {
    yield mapperFn(entry);
  }
};

const iso = {
  fromDate: date => date.toString(),
  toDate: isoString => new Date(isoString),
};

const iter = {
  encodeEntries: iterMapper(([key, val]) => [iso.fromDate(key), val]),
  decodeEntries: iterMapper(([key, val]) => [iso.toDate(key), val]),
  encodeKeys: iterMapper(iso.fromDate),
  decodeKeys: iterMapper(iso.toDate),
};

class DateMap extends Map {
  constructor(iterable) {
    super(iterable ? iter.encodeEntries(iterable) : []);
  }
  get(key) {
    return super.get(iso.fromDate(key));
  }
  has(key) {
    return super.has(iso.fromDate(key));
  }
  set(key, val) {
    return super.set(iso.fromDate(key), val);
  }
  entries() {
    return iter.decodeEntries(super.entries(this));
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

module.exports = DateMap;
