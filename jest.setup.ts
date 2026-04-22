import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "",
}));
