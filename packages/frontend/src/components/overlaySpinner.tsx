import { ThreeDots } from 'react-loader-spinner';

export const OverlaySpinner = ({
  isActive,
}: {
  isActive: boolean;
}) => {
  return isActive ? (
    <div className="overlay-spinner">
      <ThreeDots
        height="80"
        width="80"
        color="#000000"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
    </div>
  ) : (
    ''
  );
};
