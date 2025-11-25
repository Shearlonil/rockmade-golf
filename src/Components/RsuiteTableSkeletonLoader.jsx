import { Placeholder, Loader } from 'rsuite';

const loaderContainerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'var(--rs-bg-card)',
    padding: 20,
    zIndex: 1
};

const RsuiteTableSkeletonLoader = ({withPlaceholder, rows = 1, cols = 1}) => {
    if (withPlaceholder) {
        return (
            <div style={loaderContainerStyle}>
                <Placeholder.Grid rows={rows} columns={cols} active />
            </div>
        );
    }

    return <Loader center backdrop content="Loading..." />;
};

export default RsuiteTableSkeletonLoader;