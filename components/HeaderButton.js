import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={FontAwesome}
      iconSize={25}
      color='white'
    />
  );
};

export default CustomHeaderButton;
