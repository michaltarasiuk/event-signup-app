import Box from 'components/Box';
import Form from 'components/Form';
import Typography from 'components/Typography';
import { Variant } from 'components/Typography/types';
import FormProvider from 'contexts/FormProvider';

import styles from './Main.module.css';
import { MainPageProps } from './types';

export default function Main(props: MainPageProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <Typography variant={Variant.Heading1}>Signup for our event</Typography>
        <Typography>
          Please fill in your personal data and select event date
        </Typography>
      </div>
      <Box>
        <FormProvider>
          <Form events={props.events} />
        </FormProvider>
      </Box>
    </div>
  );
}
