import { render } from "@testing-library/react";
import { Deck, BottomMargin } from "./deck.component";

describe('Deck', () => {
  it('should render idle state', () => {
    const result = render(<Deck loading={false} />);
    expect(result).toBeTruthy();
  });

  it('should render loading state', () => {
    const result = render(<Deck loading={true} />);
    expect(result).toBeTruthy();
  })
})

describe('BottomMargin', () => {
  it('should render', () => {
    const result = render(<BottomMargin top={0} />);
    expect(result).toBeTruthy();
  })
})

