import { Car, FlagCheckered } from 'phosphor-react-native'

import { LocationInfo, LocationInfoProps } from '../LocationInfo'

import * as S from './styles';

type Props = {
  departure: LocationInfoProps,
  arrival?: LocationInfoProps | null
}

export function Locations({ arrival = null, departure }: Props) {
  return (
    <S.Container>
      <LocationInfo 
        icon={Car}
        label={departure.label}
        description={departure.description}
      />

      {arrival && (
        <>
          <S.Line />

          <LocationInfo 
            icon={FlagCheckered}
            label={arrival.label}
            description={arrival.description}
          />
        </>
      )}
    </S.Container>
  );
}