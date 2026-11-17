import { animateElement, animateSingleValue, GroupAnimationWithThen, visualElementStore, type MotionValue, type ValueAnimationTransition } from "motion";

function completeAnimations(animations: ConstructorParameters<typeof GroupAnimationWithThen>[0], onComplete?: () => void) {
  const animation = new GroupAnimationWithThen(animations);
  if (onComplete) animation.finished.then(onComplete);
  return animation;
}

export function animateSvgEffect(
  element: SVGElement,
  keyframes: Parameters<typeof animateElement>[1],
  { onComplete, ...options }: NonNullable<Parameters<typeof animateElement>[2]> & { onComplete?: () => void },
) {
  return completeAnimations(animateElement(element, keyframes, options, visualElementStore.get(element)), onComplete);
}

export function animateNumberValue(value: MotionValue<number>, target: number, { onComplete, ...options }: ValueAnimationTransition) {
  return completeAnimations([animateSingleValue(value, target, options)], onComplete);
}
