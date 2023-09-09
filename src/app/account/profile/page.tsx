import { Card, TabPanel, Grid, Text } from "@tremor/react"

export default function ProfilePage() {
    return (
        <>
          <TabPanel>
            <Text>Profile</Text>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card>
                {/* Placeholder to set height */}
                <div className="h-28 bg-red-300" />
              </Card>
              <Card>
                {/* Placeholder to set height */}
                <div className="h-28 bg-red-300" />
              </Card>
              <Card>
                {/* Placeholder to set height */}
                <div className="h-28 bg-red-300" />
              </Card>
            </Grid>
            <div className="mt-6">
              <Card>
                <div className="h-80 bg-red-300" />
              </Card>
            </div>
          </TabPanel>
        </>
      );
}