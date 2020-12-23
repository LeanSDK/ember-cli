'use strict';

module.exports = function leanesCLIBabelConfigKey(leanesCLIBabelInstance) {
  const leanesCLIBabelConfigKey = (leanesCLIBabelInstance && leanesCLIBabelInstance.configKey) || 'babel';

  return leanesCLIBabelConfigKey;
};
