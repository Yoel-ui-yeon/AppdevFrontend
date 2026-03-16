import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { IMG, ROUTES, COLORS } from '../utils';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
      }}
    >
      <Image
        source={IMG.SECONDARY_LOGO}
        style={{
          width: 200,
          height: 200,
          marginBottom: 16,
        }}
      />
      <Text
        style={{
          color: COLORS.textDark,
          fontSize: 22,
          fontWeight: '700',
          marginBottom: 24,
        }}
      >
        Welcome Home
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate(ROUTES.PROFILE);
        }}
      >
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            backgroundColor: COLORS.primary,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: COLORS.textLight,
              fontWeight: '700',
            }}
          >
            Go to Profile
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
