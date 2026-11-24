import React, {createContext, useContext} from 'react';

function NoAsset({children}) {
  return children('');
}

export const AssetUrlContext = createContext(NoAsset);

export function PublicAsset(props) {
  const Asset = useContext(AssetUrlContext);
  return <Asset {...props} />;
}
