import { sessions } from "@/fake_data/data";
import UserView from "@/Components/UserView";
import AppLayout from "@/Components/layout/AppLayout";

const Sessions = () => {
  return (
    <AppLayout page="sessions">
      <UserView sessions={sessions} />
    </AppLayout>
  );
};

export default Sessions;
