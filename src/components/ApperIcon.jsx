import React from 'react';
import * as LucideIcons from 'lucide-react';

const ApperIcon = ({ name, className = "h-6 w-6", ...props }) => {
  // Convert the name to PascalCase if it isn't already
  const formatIconName = (iconName) => {
    return iconName
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  const iconName = formatIconName(name);
  const IconComponent = LucideIcons[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${name}" (formatted as "${iconName}") not found in Lucide React`);
    // Return a fallback icon
    const FallbackIcon = LucideIcons.HelpCircle;
    return <FallbackIcon className={className} {...props} />;
  }

  return <IconComponent className={className} {...props} />;
};

export default ApperIcon;