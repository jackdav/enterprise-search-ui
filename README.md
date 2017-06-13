# Enterprise Search UI
a project that can be implemented to view natural language searches of data stores that use elastic search for normalized data

## Dependencies:
* `npm ~2.15.5`
* `bower ~1.7.9`

#### Go to localhost:8000 to view the project

###### Normalized Data Format:

{

        name: (string) //name of the document to display.

        body: (string) //entire blob of data to search.  Some or all of this may be displayed.

        sourceLastModDate: (int) //epoch of source documents last mod date.

        uri: (string) //uri to some viewer to direct the user to

        tags: [(string),] //array of strings to allow tagging.  This can be used to help identify search and may be used to provide groupings if time allows

}
