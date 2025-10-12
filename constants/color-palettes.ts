export interface ColorPalette {
  name: string;
  baseColor: string;
  colors: string[];
}

export const colorPalettes: ColorPalette[] = [
  {
    name: 'Teal',
    baseColor: 'rgb(20, 184, 166)', // teal-500
    colors: [
      'rgb(94, 234, 212)',   // teal-300
      'rgb(45, 212, 191)',   // teal-400
      'rgb(20, 184, 166)',   // teal-500
      'rgb(13, 148, 136)',   // teal-600
      'rgb(15, 118, 110)',   // teal-700
      'rgb(17, 94, 89)',     // teal-800
      'rgb(19, 78, 74)',     // teal-900
    ]
  },
  {
    name: 'Blue',
    baseColor: 'rgb(59, 130, 246)', // blue-500
    colors: [
      'rgb(147, 197, 253)',  // blue-300
      'rgb(96, 165, 250)',   // blue-400
      'rgb(59, 130, 246)',   // blue-500
      'rgb(37, 99, 235)',    // blue-600
      'rgb(29, 78, 216)',    // blue-700
      'rgb(30, 64, 175)',    // blue-800
      'rgb(30, 58, 138)',    // blue-900
    ]
  },
  {
    name: 'Purple',
    baseColor: 'rgb(168, 85, 247)', // purple-500
    colors: [
      'rgb(196, 181, 253)',  // purple-300
      'rgb(167, 139, 250)',  // purple-400
      'rgb(168, 85, 247)',   // purple-500
      'rgb(147, 51, 234)',   // purple-600
      'rgb(126, 34, 206)',   // purple-700
      'rgb(107, 33, 168)',   // purple-800
      'rgb(88, 28, 135)',    // purple-900
    ]
  },
  {
    name: 'Gray',
    baseColor: 'rgb(107, 114, 128)', // gray-500
    colors: [
      'rgb(209, 213, 219)',  // gray-300
      'rgb(156, 163, 175)',  // gray-400
      'rgb(107, 114, 128)',  // gray-500
      'rgb(75, 85, 99)',     // gray-600
      'rgb(55, 65, 81)',     // gray-700
      'rgb(31, 41, 55)',     // gray-800
      'rgb(17, 24, 39)',     // gray-900
    ]
  },
  {
    name: 'Emerald',
    baseColor: 'rgb(16, 185, 129)', // emerald-500
    colors: [
      'rgb(110, 231, 183)',  // emerald-300
      'rgb(52, 211, 153)',   // emerald-400
      'rgb(16, 185, 129)',   // emerald-500
      'rgb(5, 150, 105)',    // emerald-600
      'rgb(4, 120, 87)',     // emerald-700
      'rgb(6, 95, 70)',      // emerald-800
      'rgb(6, 78, 59)',      // emerald-900
    ]
  },
  {
    name: 'Rose',
    baseColor: 'rgb(244, 63, 94)', // rose-500
    colors: [
      'rgb(253, 164, 175)',  // rose-300
      'rgb(251, 113, 133)',  // rose-400
      'rgb(244, 63, 94)',    // rose-500
      'rgb(225, 29, 72)',    // rose-600
      'rgb(190, 18, 60)',    // rose-700
      'rgb(159, 18, 57)',    // rose-800
      'rgb(136, 19, 55)',    // rose-900
    ]
  },
  {
    name: 'Amber',
    baseColor: 'rgb(245, 158, 11)', // amber-500
    colors: [
      'rgb(252, 211, 77)',   // amber-300
      'rgb(251, 191, 36)',   // amber-400
      'rgb(245, 158, 11)',   // amber-500
      'rgb(217, 119, 6)',    // amber-600
      'rgb(180, 83, 9)',     // amber-700
      'rgb(146, 64, 14)',    // amber-800
      'rgb(120, 53, 15)',    // amber-900
    ]
  },
  {
    name: 'Indigo',
    baseColor: 'rgb(99, 102, 241)', // indigo-500
    colors: [
      'rgb(165, 180, 252)',  // indigo-300
      'rgb(129, 140, 248)',  // indigo-400
      'rgb(99, 102, 241)',   // indigo-500
      'rgb(79, 70, 229)',    // indigo-600
      'rgb(67, 56, 202)',    // indigo-700
      'rgb(55, 48, 163)',    // indigo-800
      'rgb(49, 46, 129)',    // indigo-900
    ]
  },
  {
    name: 'Slate',
    baseColor: 'rgb(100, 116, 139)', // slate-500
    colors: [
      'rgb(203, 213, 225)',  // slate-300
      'rgb(148, 163, 184)',  // slate-400
      'rgb(100, 116, 139)',  // slate-500
      'rgb(71, 85, 105)',    // slate-600
      'rgb(51, 65, 85)',     // slate-700
      'rgb(30, 41, 59)',     // slate-800
      'rgb(15, 23, 42)',     // slate-900
    ]
  }
];