import ReactLoading from 'react-loading';

interface LoadingProps {
  // title: string;
  type: string;
  color: string;
}

const Loading: React.FC<LoadingProps> = ({  type, color }) => {
  return (
    <div>
      {/* <p>{title}</p> */}
      <ReactLoading type={type} color={color} height={100} width={100} />
    </div>
  );
};

export default Loading;
