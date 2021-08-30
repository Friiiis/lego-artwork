export default class Helper {
  public static rgbToHex(r:number, g:number, b:number) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('');
  }

  public static hexToRgb(hex:string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
      r: 0,
      g: 0,
      b: 0
  };
  }

  public static getDiffColor(cola:string, colb:string) {
    const a = Helper.hexToRgb(cola);
    const b = Helper.hexToRgb(colb);
    return Math.sqrt(Math.pow((a.r - b.r),2) + Math.pow((a.g - b.g),2) + Math.pow((a.b - b.b),2));
  }

  public static getClosestColor(col:string, colors:{name: string, hex: string}[]) {
    var scores: {
      "score": number,
      "name": string,
      "hex": string
    }[] = [];
    colors.forEach(loopColor => {
      scores.push(
        { 
          "score": Helper.getDiffColor(col, loopColor.hex),
          "name": loopColor.name,
          "hex": loopColor.hex
        }
      );
    });

    scores.sort((a, b) => (a.score >= b.score) ? 1 : -1);
    return scores[0];
  }
}
