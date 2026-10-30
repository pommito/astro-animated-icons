export interface PaintChannel {
  target: number;
  property: "opacity" | "strokeDasharray" | "strokeDashoffset";
  values: (number | number[] | null)[];
  offsets: number[];
  intervalEase: string[];
  duration: number;
  delay: number;
  ease: string;
}

export interface PaintRecipe {
  id: string;
  finish: "hold" | "restore";
  replay: "restart" | "active" | "until-clear" | "dash-incomplete" | "current";
  entry: PaintChannel[];
  returning: PaintChannel[];
}
