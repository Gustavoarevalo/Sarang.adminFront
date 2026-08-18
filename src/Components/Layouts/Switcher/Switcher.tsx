import React, { useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { Link } from 'react-router-dom';
import styles from './Switcher.module.scss';
import * as SwitcherData from './Data/SwitcherData';
import { connect } from "react-redux"
import { SwitcherAction, changePrimaryColor, darkPrimaryColor, transparentPrimaryColor, transparentBackground, BGImagePrimaryColor } from '../../CommonFileComponents/redux/action';

const Switcher = ({ SwitcherAction, changePrimaryColor, transparentBackground }) => {

  useEffect(() => {
    SwitcherData.localStorageBackUp();

  })

  return (
    <div className={styles.Switcher}>

      <div className="switcher-wrapper">
        <div className="demo_changer">
          <div className="form_holder sidebar-right1">

            <Scrollbar className="hor-scroll">
              <div className="row">
                <div className="predefined_styles">
                  <div className="swichermainleft">
                    <h4>Theme Style</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Light Theme</span>
                          <p className="onoffswitch2 my-0"><input type="radio" name="onoffswitch1" id="myonoffswitch1" disabled={true} onClick={() => SwitcherAction('LightTheme')} className="onoffswitch2-checkbox" defaultChecked />
                            <label htmlFor="myonoffswitch1" className="onoffswitch2-label"></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft">
                    <h4>COLOR TEMA</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Color Principal</span>
                          <div className="">
                            <input className="input-color-picker color-primary-light" defaultValue="#4caf50" id="colorID" type="color" data-id="bg-color" data-id1="bg-hover" data-id2="bg-border" data-id7="transparentcolor" name="lightPrimary" onChange={(ele) => { changePrimaryColor(ele.target.value) }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft switcher-layout">
                    <h4>Layout Positions</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Fixed</span>
                          <p className="onoffswitch2 my-0"><input type="radio" name="onoffswitch5" id="myonoffswitch11" className="onoffswitch2-checkbox" onClick={() => { SwitcherAction('Fixed') }} defaultChecked />
                            <label htmlFor="myonoffswitch11" className="onoffswitch2-label"></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Scrollable</span>
                          <p className="onoffswitch2 my-0"><input type="radio" name="onoffswitch5" id="myonoffswitch12" className="onoffswitch2-checkbox" onClick={() => { SwitcherAction('Scrollable') }} />
                            <label htmlFor="myonoffswitch12" className="onoffswitch2-label"></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft">
                    <h4>Reset All Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section my-4">
                        <button className="btn btn-danger btn-block"
                          onClick={() => { SwitcherAction('ResetAll') }}
                          type="button">Reset All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      </div>
      {/* <!-- End Switcher --> */}
    </div>
  )
};


Switcher.defaultProps = {};

const mapStateToProps = (state) => ({
  local_varaiable: state
})

export default connect(mapStateToProps, { SwitcherAction, changePrimaryColor, darkPrimaryColor, transparentPrimaryColor, transparentBackground, BGImagePrimaryColor })(Switcher);

