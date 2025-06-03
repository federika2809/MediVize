import React from 'react';

function SkeletonLoader({ type = 'card', count = 1 }) {
  const CardSkeleton = () => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm animate-pulse mb-4">
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  const FormSkeleton = () => (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md animate-pulse w-full max-w-md mx-auto">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-8 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-10 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-10 bg-gray-300 rounded w-full mb-6"></div>
      <div className="h-12 bg-blue-300 rounded w-full"></div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'form':
        return <FormSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
}

export default SkeletonLoader;