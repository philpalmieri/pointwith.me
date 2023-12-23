import '@testing-library/jest-dom';

export const mockedNavigator = jest.fn();

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useParams: jest.fn(),
	usePathName: jest.fn(),
	useNavigate: () => mockedNavigator
}));
