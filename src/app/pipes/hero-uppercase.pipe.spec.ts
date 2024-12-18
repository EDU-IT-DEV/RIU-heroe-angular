import { HeroUppercasePipe } from './hero-uppercase.pipe';

describe('HeroUppercasePipe', () => {
  let pipe: HeroUppercasePipe;

  beforeEach(() => {
    pipe = new HeroUppercasePipe();
  });

  it('Debe crear una instancia', () => {
    expect(pipe).toBeTruthy();
  });

  it('Debe retornar el valor en mayúsculas cuando se proporciona un string', () => {
    const input = 'hero';
    const result = pipe.transform(input);
    expect(result).toBe('HERO');
  });

  it('Debe retornar una cadena vacía si el valor es null', () => {
    const input = null as any;
    const result = pipe.transform(input);
    expect(result).toBe('');
  });

  it('Debe retornar una cadena vacía si el valor es undefined', () => {
    const input = undefined as any;
    const result = pipe.transform(input);
    expect(result).toBe('');
  });

  it('Debe retornar una cadena vacía si el valor es una cadena vacía', () => {
    const input = '';
    const result = pipe.transform(input);
    expect(result).toBe('');
  });

  it('Debe manejar correctamente cadenas con espacios y retornar en mayúsculas', () => {
    const input = '  angular pipe  ';
    const result = pipe.transform(input);
    expect(result).toBe('  ANGULAR PIPE  ');
  });
});
