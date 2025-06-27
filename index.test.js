const deepMerge = require('./index');

describe('objectMerge', () => {
  it('should recursively merge objects', () => {
    const objA = {
      a: {
        b: 'c',
        d: 'e',
      },
    };

    const objB = {
      a: {
        b: 'c',
        f: 'g',
      },
    };

    expect(deepMerge(objA, objB)).toEqual({
      a: {
        b: 'c',
        d: 'e',
        f: 'g',
      },
    });
  });

  it('should put two different values that correspond to the same key at the same level into an array', () => {
    const objA = {
      a: {
        b: {
          c: {
            d: 1,
          },
        },
      },
    };

    const objB = {
      a: {
        b: {
          c: {
            d: 2,
          },
        },
      },
    };

    expect(deepMerge(objA, objB)).toEqual({
      a: {
        b: {
          c: {
            d: [1, 2],
          },
        },
      },
    });
  });

  it('should ignore a duplicated value in objB that corresponds to the same key at the same level', () => {
    const objA = {
      a: 'myValue',
    };

    const objB = {
      a: 'myValue',
    };

    expect(deepMerge(objA, objB)).toEqual({
      a: 'myValue',
    });
  });

  it('should merge values into arrays when encountered asymmetrically', () => {
    const objA = {
      a: [1, 2, 3],
    };

    const objB = {
      a: 4,
    };

    expect(deepMerge(objA, objB)).toEqual({
      a: [1, 2, 3, 4],
    });
  });

  it('should put an object and a value into an array', () => {
    const objA = {
      a: {
        b: { d: 'some string or whatever' },
      },
    };

    const objB = {
      a: {
        b: 97,
      },
    };

    expect(deepMerge(objA, objB)).toEqual({
      a: {
        b: [{ d: 'some string or whatever' }, 97],
      },
    });
  });

  it('should merge values from two arrays into one array', () => {
    const objA = {
      a: [1, 2],
    };

    const objB = {
      a: [3, 4, 5],
    };

    expect(deepMerge(objA, objB)).toEqual({
      a: [1, 2, 3, 4, 5],
    });
  });

  it.each([
    {
      title: 'null value & value',
      objA: {
        a: {
          b: null,
        },
      },
      objB: {
        a: {
          b: 'myValue',
          c: null,
        },
      },
      result: { a: { b: [null, 'myValue'], c: null } },
    },
    {
      title: 'value & null value',
      objA: {
        a: {
          b: 'myValue',
        },
      },
      objB: {
        a: {
          b: null,
          c: null,
        },
      },
      result: { a: { b: ['myValue', null], c: null } },
    },
    {
      title: 'array & value',
      objA: { a: [1, 2] },
      objB: { a: null },
      result: { a: [1, 2, null] },
    },
    {
      title: 'value & array',
      objA: { a: null },
      objB: { a: [1, 2] },
      result: { a: [null, 1, 2] },
    },
    {
      title: 'array with undefined element & array',
      objA: { a: [1, 2] },
      objB: { a: [null, 3] },
      result: { a: [1, 2, null, 3] },
    },
    {
      title: 'array & array with undefined element',
      objA: { a: [null, 1] },
      objB: { a: [2, 3] },
      result: { a: [null, 1, 2, 3] },
    },
  ])(
    'should merge null values like any other defined value, in configuration: $title',
    ({ objA, objB, result }) => {
      expect(deepMerge(objA, objB)).toEqual(result);
    },
  );

  it.each([
    {
      title: 'value & value',
      objA: {
        a: {
          b: undefined,
        },
      },
      objB: {
        a: {
          b: 'myValue',
          c: undefined,
        },
      },
      result: { a: { b: 'myValue' } },
    },
    {
      title: 'array & value',
      objA: { a: [1, 2] },
      objB: { a: undefined },
      result: { a: [1, 2] },
    },
    {
      title: 'value & array',
      objA: { a: undefined },
      objB: { a: [1, 2] },
      result: { a: [1, 2] },
    },
    {
      title: 'array with undefined element & array',
      objA: { a: [1, 2] },
      objB: { a: [undefined, 3] },
      result: { a: [1, 2, 3] },
    },
    {
      title: 'array & array with undefined element',
      objA: { a: [undefined, 1] },
      objB: { a: [2, 3] },
      result: { a: [1, 2, 3] },
    },
  ])(
    'should ignore undefined values in configuration: $title',
    ({ objA, objB, result }) => {
      expect(deepMerge(objA, objB)).toEqual(result);
    },
  );

  it('should use provided duplicateKeyHandler if provided as a property on the 3rd parameter', () => {
    const objA = {
      a: {
        b: 'c',
      },
    };

    const objB = {
      a: {
        b: 'd',
      },
    };

    function conflictHandler(a, b) {
      return 'it worked!';
    }

    expect(deepMerge(objA, objB, conflictHandler)).toEqual({
      a: {
        b: 'it worked!',
      },
    });
  });

  it('should put top-level non-object values into an array', () => {
    const a = 97;
    const b = {
      myString: 'mega',
    };

    expect(deepMerge(a, b)).toEqual([97, { myString: 'mega' }]);
  });
});
