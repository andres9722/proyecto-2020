import formatMoney from '../lib/formatMoney';

describe('formatMoney Function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('COP 1.00');
    expect(formatMoney(10)).toEqual('COP 10.00');
    expect(formatMoney(9)).toEqual('COP 9');
    expect(formatMoney(40)).toEqual('COP 40');
  });

  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(5000)).toEqual('COP 5000');
    expect(formatMoney(100)).toEqual('COP 100');
    expect(formatMoney(50000000)).toEqual('COP 50.000.000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(5012)).toEqual('COP 5,012.00');
    expect(formatMoney(101)).toEqual('COP 101.00');
    expect(formatMoney(110)).toEqual('COP 110.00');
  });
});
