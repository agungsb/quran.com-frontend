import React, { Component } from 'react';
import * as customPropTypes from 'customPropTypes';
import Helmet from 'react-helmet';
import IndexHeader from 'components/IndexHeader';
import cookie from 'react-cookie';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import debug from 'helpers/debug';
import LastVisit from 'components/Home/LastVisit';
import SurahsList from 'components/Home/SurahsList';
import JuzList from 'components/Home/JuzList';
import QuickSurahs from 'components/Home/QuickSurahs';
import LocaleFormattedMessage from 'components/LocaleFormattedMessage';
import Tabs, { Tab } from 'quran-components/lib/Tabs';
import Loader from 'quran-components/lib/Loader';

import { chaptersConnect, juzsConnect } from '../Surah/connect';

const styles = require('./style.scss');

class Home extends Component {
  renderJuzList() {
    const { chapters, juzs } = this.props;

    if (juzs.loading) {
      return <div className="row"><Loader isActive relative /></div>;
    }

    const juzList = Object.values(juzs.entities);

    return (
      <div className="row">
        <JuzList chapters={chapters} juzs={juzList.slice(0, 10)} />
        <JuzList chapters={chapters} juzs={juzList.slice(10, 20)} />
        <JuzList chapters={chapters} juzs={juzList.slice(20, 30)} />
      </div>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderChapterList(chaptersList) {
    return (
      <div className="row">
        <SurahsList chapters={chaptersList.slice(0, 38)} />
        <SurahsList chapters={chaptersList.slice(38, 76)} />
        <SurahsList chapters={chaptersList.slice(76, 114)} />
      </div>
    );
  }

  render() {
    debug('component:Home', 'Render');

    const lastVisit = cookie.load('lastVisit') || null;
    const { chapters } = this.props;
    const chaptersList = Object.values(chapters);

    const chapterTitle = (
      <span className={`text-muted ${styles.title}`}>
        <LocaleFormattedMessage
          id="surah.index.heading"
          defaultMessage="SURAHS (CHAPTERS)"
        />
      </span>
    );

    const juzTitle = (
      <span className={`text-muted ${styles.title}`}>
        <LocaleFormattedMessage id="juz.index.heading" defaultMessage="Juz" />
      </span>
    );

    return (
      <div className="index-page">
        <Helmet title="The Noble Quran - القرآن الكريم" titleTemplate="%s" />
        <IndexHeader />
        <div className={`container ${styles.list}`}>
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              {lastVisit &&
                <LastVisit
                  chapter={chapters[lastVisit.chapterId]}
                  verse={lastVisit.verseId}
                />}
              <QuickSurahs />

              <Tabs>
                <Tab title={chapterTitle}>
                  {this.renderChapterList(chaptersList)}
                </Tab>

                <Tab title={juzTitle}>
                  {this.renderJuzList()}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  chapters: customPropTypes.chapters.isRequired,
  juzs: customPropTypes.juzs.isRequired
};

const AsyncHome = asyncConnect([
  { promise: chaptersConnect },
  { promise: juzsConnect }
])(Home);

function mapStateToProps(state) {
  return {
    chapters: state.chapters.entities,
    juzs: state.juzs
  };
}

export default connect(mapStateToProps)(AsyncHome);
