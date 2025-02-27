/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2021 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createSearchAppInit } from "@js/invenio_search_ui";
import {
  SearchAppFacets,
  SearchAppResultsPane,
  InvenioSearchPagination,
} from "@js/invenio_search_ui/components";
import { i18next } from "@translations/invenio_communities/i18next";
import React from "react";
import { GridResponsiveSidebarColumn } from "react-invenio-forms";
import { parametrize } from "react-overridable";
import {
  Count,
  ResultsList,
  SearchBar,
  Sort,
  withState,
} from "react-searchkit";
import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Segment,
} from "semantic-ui-react";
import { ComputerTabletCommunitiesItem } from "./communities_items/ComputerTabletCommunitiesItem";
import { MobileCommunitiesItem } from "./communities_items/MobileCommunitiesItem";
import {
  ContribSearchAppFacets,
  ContribBucketAggregationValuesElement,
} from "@js/invenio_search_ui/components";

function ResultsGridItemTemplate({ result }) {
  return (
    <Card fluid href={`/communities/${result.slug}`}>
      <Card.Content>
        <Card.Header>{result.metadata.title}</Card.Header>
        <Card.Description>
          <div
            className="truncate-lines-2"
            dangerouslySetInnerHTML={{
              __html: result.metadata.description,
            }}
          />
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

function ResultsItemTemplate({ result }) {
  return (
    <>
      <ComputerTabletCommunitiesItem result={result} />
      <MobileCommunitiesItem result={result} />
    </>
  );
}

export const CommunitiesResults = ({
  sortOptions,
  paginationOptions,
  currentResultsState,
}) => {
  const { total } = currentResultsState.data;
  return (
    total && (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <Grid>
                <Grid.Row
                  verticalAlign="middle"
                  className="small pt-5 pb-5 highlight-background"
                >
                  <Grid.Column width={4}>
                    <Count
                      label={() => (
                        <>
                          {i18next.t("{{total}} result(s) found", {
                            total: total,
                          })}
                        </>
                      )}
                    />
                  </Grid.Column>
                  <Grid.Column width={12} textAlign="right" className="pr-5">
                    {sortOptions && (
                      <Sort
                        values={sortOptions}
                        label={(cmp) => (
                          <>
                            <label className="mr-10">
                              {i18next.t("Sort by")}
                            </label>
                            {cmp}
                          </>
                        )}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <ResultsList />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <InvenioSearchPagination paginationOptions={paginationOptions} />
      </Grid>
    )
  );
};

export const CommunitiesSearchBarElement = withState(
  ({
    placeholder: passedPlaceholder,
    queryString,
    onInputChange,
    updateQueryState,
    currentQueryState,
  }) => {
    const placeholder = passedPlaceholder || i18next.t("Search");

    const onSearch = () => {
      updateQueryState({ ...currentQueryState, queryString });
    };
    const onBtnSearchClick = () => {
      onSearch();
    };
    const onKeyPress = (event) => {
      if (event.key === "Enter") {
        onSearch();
      }
    };

    return (
      <Input
        action={{
          icon: "search",
          onClick: onBtnSearchClick,
          className: "search",
        }}
        fluid
        placeholder={placeholder}
        onChange={(event, { value }) => {
          onInputChange(value);
        }}
        value={queryString}
        onKeyPress={onKeyPress}
      />
    );
  }
);

const RDMBucketAggregationElement = ({ title, containerCmp }) => {
  return (
    <Card className="borderless facet">
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        {containerCmp}
      </Card.Content>
    </Card>
  );
};
export const CommunitiesSearchLayout = (props) => {
  const [sidebarVisible, setSidebarVisible] = React.useState(false);

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column
            only="mobile tablet"
            mobile={2}
            tablet={1}
            verticalAlign="middle"
            className="mt-10"
          >
            <Button
              basic
              icon="sliders"
              onClick={() => setSidebarVisible(true)}
              aria-label={i18next.t("Filter results")}
            />
          </Grid.Column>
          <Grid.Column
            mobile={14}
            tablet={9}
            computer={8}
            floated="right"
            className="mt-10"
          >
            <SearchBar placeholder={i18next.t("Search communities...")} />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={4} className="mt-10">
            <Button
              positive
              icon="upload"
              labelPosition="left"
              href="/communities/new"
              content={i18next.t("New community")}
              floated="right"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <GridResponsiveSidebarColumn
            width={4}
            open={sidebarVisible}
            onHideClick={() => setSidebarVisible(false)}
            children={<SearchAppFacets aggs={props.config.aggs} />}
          />
          <Grid.Column mobile={16} tablet={16} computer={12}>
            <SearchAppResultsPane layoutOptions={props.config.layoutOptions} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

const ContribSearchAppFacetsWithConfig = parametrize(ContribSearchAppFacets, {
  help: false,
});

const defaultComponents = {
  "BucketAggregation.element": RDMBucketAggregationElement,
  "BucketAggregationValues.element": ContribBucketAggregationValuesElement,
  "SearchApp.facets": ContribSearchAppFacetsWithConfig,
  "ResultsList.item": ResultsItemTemplate,
  "ResultsGrid.item": ResultsGridItemTemplate,
  "SearchApp.layout": CommunitiesSearchLayout,
  "SearchBar.element": CommunitiesSearchBarElement,
  "SearchApp.results": CommunitiesResults,
};

// Auto-initialize search app
createSearchAppInit(defaultComponents);
